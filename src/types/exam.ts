export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E';
export type GradeLevel = '10' | '12';
export type Language = 'id' | 'en';

export interface QuestionLocalized {
  question: string;
  options: {
    key: OptionKey;
    text: string;
  }[];
  topic: string;
  explanation: string;
  imageCaption?: string;
}

export interface Question {
  id: number;
  question: string;
  options: {
    key: OptionKey;
    text: string;
  }[];
  correctAnswer: OptionKey;
  topic: string;
  explanation: string;
  level: number;
  imageType?: 'cat_variety' | 'panthera_species' | 'biogeography_map' | 'forest_road_fragmentation' | 'insitu_exsitu_conservation';
  imageUrl?: string;
  images?: { label: string; url: string; caption?: string }[];
  imageCaption?: string;
  en?: QuestionLocalized;
}

export interface StudentInfo {
  name: string;
  className: string;
  gradeLevel: GradeLevel;
  packageTitle?: string;
  language?: Language;
}

export interface StepAnswer {
  stepIndex: number; // 1 to 20 (Grade 10 & Grade 12)
  questionId: number;
  selectedOption: OptionKey;
  isCorrect: boolean;
  correctAnswer: OptionKey;
  nextQuestionId: number | 'SELESAI';
  timeSpentSeconds: number;
  pointsEarned?: number; // 2 (golden correct), 1 (branch correct), 0 (incorrect)
  isOnGoldenPath?: boolean;
}

export interface DestinationZone {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  isIdeal: boolean;
  color: string;
  badge: string;
}

export interface StudentSubmission {
  id: string;
  timestamp: string;
  name: string;
  className: string;
  gradeLevel?: GradeLevel;
  packageTitle?: string;
  language?: Language;
  correctCount: number;
  totalQuestions: number;
  scoreMaze: number; // raw points (max 40 for both K10 & K12)
  scoreScale100: number; // score out of 40
  status: 'Sampai Tujuan Utama' | 'Tersesat di Labirin' | 'Selesai Sempurna';
  durationFormatted: string;
  answerHistory: string; // Riwayat jawaban lengkap siswa
  violationsCount?: number; // Jumlah terdeteksi pindah tab / keluar layar penuh
  syncedToGoogleSheets?: boolean;
}
