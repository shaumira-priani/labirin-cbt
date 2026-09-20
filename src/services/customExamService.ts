// src/services/customExamService.ts
//
// All Firestore/Auth calls for the teacher-uploaded custom exam system live
// here. The existing maze quizzes (Kehati/Metabolisme) do NOT use this file
// — they keep reading from questionsData.ts / questionsDataK12.ts as before.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  increment,
  type Unsubscribe,
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { generateMazeGraph } from '../utils/mazeGraphGenerator';
import type {
  TeacherProfile,
  CustomExamDoc,
  ClassTokenDoc,
  CustomQuestionDoc,
  CustomSessionDoc,
} from '../types/customExam';
import type { OptionKey } from '../types/exam';

// --- Teacher auth -----------------------------------------------------

export async function registerTeacher(name: string, email: string, password: string): Promise<TeacherProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const profile: TeacherProfile = { uid: cred.user.uid, name, email, createdAt: Date.now() };
  await setDoc(doc(db, 'teachers', cred.user.uid), profile);
  return profile;
}

export async function loginTeacher(email: string, password: string): Promise<User> {
  return (await signInWithEmailAndPassword(auth, email, password)).user;
}

export async function logoutTeacher(): Promise<void> {
  await signOut(auth);
}

export function watchAuthState(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// --- Student auth (anonymous) -----------------------------------------

export async function signInStudentAnonymously(): Promise<string> {
  return (await signInAnonymously(auth)).user.uid;
}

// --- Exams --------------------------------------------------------------

function randomCode(len = 6): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function createExam(
  teacherId: string,
  data: { title: string; subject: string; durationMinutes: number; classNames: string[] }
): Promise<CustomExamDoc> {
  const examRef = doc(collection(db, 'exams'));
  const exam: CustomExamDoc = {
    id: examRef.id,
    teacherId,
    title: data.title,
    subject: data.subject,
    durationMinutes: data.durationMinutes,
    totalQuestions: 0,
    status: 'draft',
    createdAt: Date.now(),
  };
  await setDoc(examRef, exam);

  // One access code per class, right away
  await Promise.all(
    data.classNames
      .map((c) => c.trim())
      .filter(Boolean)
      .map((className) => {
        const tokenRef = doc(collection(db, 'exams', examRef.id, 'classTokens'));
        const tokenDoc: ClassTokenDoc = {
          id: tokenRef.id,
          className,
          accessCode: randomCode(),
          createdAt: Date.now(),
        };
        return setDoc(tokenRef, tokenDoc);
      })
  );

  return exam;
}

export async function getExamsForTeacher(teacherId: string): Promise<CustomExamDoc[]> {
  const snap = await getDocs(query(collection(db, 'exams'), where('teacherId', '==', teacherId)));
  return snap.docs.map((d) => d.data() as CustomExamDoc);
}

export async function getExam(examId: string): Promise<CustomExamDoc | null> {
  const snap = await getDoc(doc(db, 'exams', examId));
  return snap.exists() ? (snap.data() as CustomExamDoc) : null;
}

export async function getClassTokens(examId: string): Promise<ClassTokenDoc[]> {
  const snap = await getDocs(collection(db, 'exams', examId, 'classTokens'));
  return snap.docs.map((d) => d.data() as ClassTokenDoc);
}

export async function addClassToken(examId: string, className: string): Promise<ClassTokenDoc> {
  const tokenRef = doc(collection(db, 'exams', examId, 'classTokens'));
  const tokenDoc: ClassTokenDoc = { id: tokenRef.id, className, accessCode: randomCode(), createdAt: Date.now() };
  await setDoc(tokenRef, tokenDoc);
  return tokenDoc;
}

/** Flattened list of {examId, title, subject, className} across every
 *  published exam's classTokens — used to populate the student's
 *  Kelas -> Mapel -> Materi dropdown picker. */
export async function getPublishedExamOptions(): Promise<
  { examId: string; title: string; subject: string; className: string }[]
> {
  const examsSnap = await getDocs(query(collection(db, 'exams'), where('status', '==', 'published')));
  const results: { examId: string; title: string; subject: string; className: string }[] = [];

  await Promise.all(
    examsSnap.docs.map(async (examDoc) => {
      const exam = examDoc.data() as CustomExamDoc;
      if (!exam.mazeGraph || exam.totalQuestions === 0) return; // not actually playable yet
      const tokensSnap = await getDocs(collection(db, 'exams', exam.id, 'classTokens'));
      tokensSnap.docs.forEach((t) => {
        const token = t.data() as ClassTokenDoc;
        results.push({ examId: exam.id, title: exam.title, subject: exam.subject, className: token.className });
      });
    })
  );

  return results;
}

/** Looks up the access code for one specific exam + class combination
 *  (used by the picker flow to validate the token the student types in). */
export async function getAccessCodeForExamClass(examId: string, className: string): Promise<string | null> {
  const snap = await getDocs(
    query(collection(db, 'exams', examId, 'classTokens'), where('className', '==', className))
  );
  if (snap.empty) return null;
  return (snap.docs[0].data() as ClassTokenDoc).accessCode;
}

export async function publishExam(examId: string, goldenPathCount?: number): Promise<void> {
  const questions = await getExamQuestions(examId);
  const mazeGraph = generateMazeGraph(questions, goldenPathCount);
  await updateDoc(doc(db, 'exams', examId), { status: 'published', mazeGraph });
}

/** Searches every published exam's classTokens for a matching access code.
 *  Returns the exam + which class it belongs to, or null if not found. */
export async function findExamByAccessCode(
  accessCode: string
): Promise<{ exam: CustomExamDoc; className: string } | null> {
  const code = accessCode.trim().toUpperCase();
  const examsSnap = await getDocs(query(collection(db, 'exams'), where('status', '==', 'published')));

  for (const examDoc of examsSnap.docs) {
    const tokensSnap = await getDocs(
      query(collection(db, 'exams', examDoc.id, 'classTokens'), where('accessCode', '==', code))
    );
    if (!tokensSnap.empty) {
      return {
        exam: examDoc.data() as CustomExamDoc,
        className: (tokensSnap.docs[0].data() as ClassTokenDoc).className,
      };
    }
  }
  return null;
}

// --- Questions ------------------------------------------------------------

export async function saveExamQuestions(examId: string, questions: Omit<CustomQuestionDoc, 'id'>[]): Promise<void> {
  const colRef = collection(db, 'exams', examId, 'questions');
  await Promise.all(
    questions.map((q) => {
      const qRef = doc(colRef);
      return setDoc(qRef, { ...q, id: qRef.id });
    })
  );
  await updateDoc(doc(db, 'exams', examId), { totalQuestions: questions.length });
}

export async function updateExamQuestion(
  examId: string,
  questionId: string,
  patch: Partial<Omit<CustomQuestionDoc, 'id'>>
): Promise<void> {
  const cleaned: Record<string, unknown> = {};
  Object.entries(patch).forEach(([k, v]) => {
    if (v !== undefined) cleaned[k] = v;
  });
  await updateDoc(doc(db, 'exams', examId, 'questions', questionId), cleaned);
}

export async function getExamQuestions(examId: string): Promise<CustomQuestionDoc[]> {
  const snap = await getDocs(collection(db, 'exams', examId, 'questions'));
  return snap.docs.map((d) => d.data() as CustomQuestionDoc).sort((a, b) => a.order - b.order);
}

// --- Sessions ---------------------------------------------------------

export async function startSession(
  exam: CustomExamDoc,
  studentUid: string,
  studentName: string,
  studentClass: string
): Promise<CustomSessionDoc> {
  const sessionRef = doc(collection(db, 'sessions'));
  const session: CustomSessionDoc = {
    id: sessionRef.id,
    examId: exam.id,
    teacherId: exam.teacherId,
    studentUid,
    studentName,
    studentClass,
    status: 'in_progress',
    answeredCount: 0,
    totalQuestions: exam.totalQuestions,
    score: null,
    startTime: Date.now(),
    endTime: null,
    violationsCount: 0,
    answers: [],
  };
  await setDoc(sessionRef, session);
  return session;
}

/** Overwrites the session's full answers array (instead of incremental
 *  append) so the "Back to previous question" feature can shrink it too. */
export async function syncSessionAnswers(
  sessionId: string,
  answers: CustomSessionDoc['answers']
): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), {
    answers,
    answeredCount: answers.length,
  });
}

export async function recordViolation(sessionId: string): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), { violationsCount: increment(1) });
}

export async function submitSession(sessionId: string, score: number): Promise<void> {
  await updateDoc(doc(db, 'sessions', sessionId), { status: 'submitted', score, endTime: Date.now() });
}

export function watchExamSessions(
  examId: string,
  teacherId: string,
  onChange: (sessions: CustomSessionDoc[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'sessions'), where('examId', '==', examId), where('teacherId', '==', teacherId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as CustomSessionDoc)),
    (error) => onError?.(error)
  );
}
