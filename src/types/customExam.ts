// src/types/customExam.ts
//
// Data model for TEACHER-UPLOADED custom exams. This is a separate, simpler
// system from the built-in branching maze quizzes (Kehati / Metabolisme):
// custom exams are sequential (question 1, 2, 3... in order), because
// auto-generating a branching golden-path graph from an arbitrary uploaded
// question list isn't reliable. The two maze quizzes are untouched.

import type { OptionKey } from './exam';
import type { MazeGraph } from '../utils/mazeGraphGenerator';

export type ExamStatus = 'draft' | 'published' | 'closed';
export type SessionStatus = 'not_started' | 'in_progress' | 'submitted';

export interface TeacherProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
}

/** exams/{examId} */
export interface CustomExamDoc {
  id: string;
  teacherId: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  status: ExamStatus;
  createdAt: number;
  mazeGraph?: MazeGraph; // generated automatically when the teacher publishes
}

/** exams/{examId}/classTokens/{tokenId} — one access code per class */
export interface ClassTokenDoc {
  id: string;
  className: string;
  accessCode: string;
  createdAt: number;
}

/** exams/{examId}/questions/{questionId} */
export interface CustomQuestionDoc {
  id: string;
  order: number;
  question: string;
  options: { key: OptionKey; text: string }[];
  correctAnswer: OptionKey;
  explanation: string;
  topic?: string;
  imageUrl?: string;
}

/** sessions/{sessionId} — one per student attempt at a custom exam */
export interface CustomSessionDoc {
  id: string;
  examId: string;
  teacherId: string;
  studentUid: string;
  studentName: string;
  studentClass: string;
  status: SessionStatus;
  answeredCount: number;
  totalQuestions: number;
  score: number | null;
  startTime: number | null;
  endTime: number | null;
  violationsCount: number;
  answers: {
    questionId: string;
    selectedOption: OptionKey;
    isCorrect: boolean;
    isOnGoldenPath: boolean;
    pointsEarned: number;
    answeredAt: number;
  }[];
}

/** Parsed-but-not-yet-saved question, used in the upload preview screen. */
export interface DraftQuestion {
  tempId: string; // client-side only, for React keys / editing
  order: number;
  question: string;
  options: { key: OptionKey; text: string }[];
  correctAnswer: OptionKey | '';
  explanation: string;
  topic?: string;
  imageUrl?: string;
  error?: string; // validation message shown inline in the preview table
}
