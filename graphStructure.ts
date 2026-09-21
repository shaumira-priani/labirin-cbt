import { OptionKey, DestinationZone, StepAnswer } from '../types/exam';
import { QUESTIONS_DATA } from './questionsData';

export const GOLDEN_PATH: number[] = [
  37, // Step 1: Tingkatan Keanekaragaman Hayati
  41, // Step 2: [VISUAL] Keanekaragaman Hayati Tingkat Gen (Kucing)
  42, // Step 3: [VISUAL] Keanekaragaman Hayati Tingkat Jenis (Panthera)
  36, // Step 4: Garis Wallace
  33, // Step 5: Karakteristik Hutan Hujan Tropis
  43, // Step 6: [VISUAL] Biogeografi Indonesia & Garis Weber Y
  31, // Step 7: Fauna Asiatis & Ciri-cirinya
  28, // Step 8: Fauna Peralihan/Wallacea
  26, // Step 9: Fauna Australis
  23, // Step 10: Flora Malesiana & Tumbuhan Endemik
  21, // Step 11: Manfaat Ekologis Keanekaragaman Hayati
  44, // Step 12: [VISUAL] Ancaman Fragmentasi Habitat & Pembukaan Jalan
  18, // Step 13: Ancaman Eksploitasi & Spesies Invasif
  16, // Step 14: Perubahan Iklim & Keanekaragaman Ekosistem
  45, // Step 15: [VISUAL] Pelestarian In-Situ vs Ex-Situ
  13, // Step 16: Kawasan Cagar Alam & Suaka Margasatwa
  11, // Step 17: Taman Nasional di Indonesia
  10, // Step 18: Restorasi Ekosistem & Koridor Satwa
  5,  // Step 19: Keanekaragaman Hayati Tingkat Gen & Plasma Nutfah
  1   // Step 20: Konservasi Berkelanjutan & Ekosistem Lestari (Titik Puncak)
];

export const LEVEL_QUESTIONS: Record<number, number[]> = {
  1: [37],
  2: [41, 38, 39, 40],
  3: [42, 35, 34],
  4: [36, 32, 30],
  5: [33, 29, 27],
  6: [43, 25, 24],
  7: [31, 22, 20],
  8: [28, 19, 17],
  9: [26, 15, 14],
  10: [23, 12, 9],
  11: [21, 8, 7],
  12: [44, 6],
  13: [18, 4],
  14: [16, 3],
  15: [45, 2],
  16: [13, 8],
  17: [11, 6],
  18: [10, 4],
  19: [5, 3],
  20: [1, 2]
};

// Deterministic transitions for all 45 questions based on Option Selected
export const QUESTION_TRANSITIONS: Record<number, Record<OptionKey, number | 'SELESAI'>> = {
  // Level 1
  37: {
    A: 41, // Correct (Golden Step 2)
    B: 38,
    C: 39,
    D: 40,
    E: 38
  },
  // Level 2
  41: {
    A: 42, // Correct (Golden Step 3)
    B: 35,
    C: 34,
    D: 35,
    E: 34
  },
  38: {
    A: 42, // Correct
    B: 35,
    C: 34,
    D: 35,
    E: 34
  },
  39: {
    A: 34, // Correct
    B: 35,
    C: 42,
    D: 35,
    E: 34
  },
  40: {
    B: 35, // Correct
    A: 34,
    C: 42,
    D: 35,
    E: 34
  },
  // Level 3
  42: {
    A: 36, // Correct (Golden Step 4)
    B: 32,
    C: 30,
    D: 32,
    E: 30
  },
  35: {
    C: 36, // Correct
    A: 30,
    B: 32,
    D: 30,
    E: 32
  },
  34: {
    A: 32, // Correct
    B: 30,
    C: 36,
    D: 30,
    E: 32
  },
  // Level 4
  36: {
    A: 33, // Correct (Golden Step 5)
    B: 29,
    C: 27,
    D: 29,
    E: 27
  },
  32: {
    B: 33, // Correct
    A: 27,
    C: 29,
    D: 27,
    E: 29
  },
  30: {
    B: 29, // Correct
    A: 27,
    C: 33,
    D: 27,
    E: 29
  },
  // Level 5
  33: {
    B: 43, // Correct (Golden Step 6)
    A: 25,
    C: 24,
    D: 25,
    E: 24
  },
  29: {
    C: 43, // Correct
    A: 24,
    B: 25,
    D: 24,
    E: 25
  },
  27: {
    B: 25, // Correct
    A: 24,
    C: 43,
    D: 24,
    E: 25
  },
  // Level 6
  43: {
    A: 31, // Correct (Golden Step 7)
    B: 22,
    C: 20,
    D: 22,
    E: 20
  },
  25: {
    A: 31, // Correct
    B: 20,
    C: 22,
    D: 20,
    E: 22
  },
  24: {
    B: 22, // Correct
    A: 20,
    C: 31,
    D: 20,
    E: 22
  },
  // Level 7
  31: {
    B: 28, // Correct (Golden Step 8)
    A: 19,
    C: 17,
    D: 19,
    E: 17
  },
  22: {
    C: 28, // Correct
    A: 17,
    B: 19,
    D: 17,
    E: 19
  },
  20: {
    A: 19, // Correct
    B: 17,
    C: 28,
    D: 17,
    E: 19
  },
  // Level 8
  28: {
    B: 26, // Correct (Golden Step 9)
    A: 15,
    C: 14,
    D: 15,
    E: 14
  },
  19: {
    A: 26, // Correct
    B: 14,
    C: 15,
    D: 14,
    E: 15
  },
  17: {
    C: 15, // Correct
    A: 14,
    B: 26,
    D: 14,
    E: 15
  },
  // Level 9
  26: {
    A: 23, // Correct (Golden Step 10)
    B: 12,
    C: 9,
    D: 12,
    E: 9
  },
  15: {
    B: 23, // Correct
    A: 9,
    C: 12,
    D: 9,
    E: 12
  },
  14: {
    A: 12, // Correct
    B: 9,
    C: 23,
    D: 9,
    E: 12
  },
  // Level 10
  23: {
    B: 21, // Correct (Golden Step 11)
    A: 8,
    C: 7,
    D: 8,
    E: 7
  },
  12: {
    B: 21, // Correct
    A: 7,
    C: 8,
    D: 7,
    E: 8
  },
  9: {
    A: 8, // Correct
    B: 7,
    C: 21,
    D: 7,
    E: 8
  },
  // Level 11
  21: {
    B: 44, // Correct (Golden Step 12)
    A: 6,
    C: 6,
    D: 6,
    E: 6
  },
  8: {
    B: 44, // Correct
    A: 6,
    C: 44,
    D: 6,
    E: 6
  },
  7: {
    C: 44, // Correct
    A: 6,
    B: 6,
    D: 6,
    E: 44
  },
  // Level 12
  44: {
    A: 18, // Correct (Golden Step 13)
    B: 4,
    C: 4,
    D: 4,
    E: 4
  },
  6: {
    B: 18, // Correct
    A: 4,
    C: 18,
    D: 4,
    E: 4
  },
  // Level 13
  18: {
    B: 16, // Correct (Golden Step 14)
    A: 3,
    C: 3,
    D: 3,
    E: 3
  },
  4: {
    C: 16, // Correct
    A: 3,
    B: 3,
    D: 3,
    E: 3
  },
  // Level 14
  16: {
    B: 45, // Correct (Golden Step 15)
    A: 2,
    C: 2,
    D: 2,
    E: 2
  },
  3: {
    A: 45, // Correct
    B: 2,
    C: 2,
    D: 2,
    E: 2
  },
  // Level 15
  45: {
    A: 13, // Correct (Golden Step 16)
    B: 8,
    C: 8,
    D: 8,
    E: 8
  },
  2: {
    B: 13, // Correct
    A: 8,
    C: 13,
    D: 8,
    E: 8
  },
  // Level 16
  13: {
    B: 11, // Correct (Golden Step 17)
    A: 6,
    C: 6,
    D: 6,
    E: 6
  },
  // Level 17
  11: {
    B: 10, // Correct (Golden Step 18)
    A: 4,
    C: 4,
    D: 4,
    E: 4
  },
  // Level 18
  10: {
    B: 5, // Correct (Golden Step 19)
    A: 3,
    C: 3,
    D: 3,
    E: 3
  },
  // Level 19
  5: {
    A: 1, // Correct (Golden Step 20)
    B: 2,
    C: 2,
    D: 2,
    E: 2
  },
  // Level 20 (Final Step -> SELESAI)
  1: {
    A: 'SELESAI',
    B: 'SELESAI',
    C: 'SELESAI',
    D: 'SELESAI',
    E: 'SELESAI'
  }
};

export const DESTINATION_ZONES: Record<string, DestinationZone> = {
  puncak: {
    id: 'puncak',
    title: 'Zona Konservasi Utama (Titik Tujuan Sempurna)',
    subtitle: 'Rute Emas 20/20 — Selesai di Pos Konservasi Soal #1',
    description: 'Selamat! Kamu berhasil menelusuri seluruh 20 percabangan dengan jawaban tepat tanpa pernah tersesat. Kamu telah menguasai seluruh pilar keanekaragaman hayati Indonesia dari tingkat gen hingga ekosistem global.',
    isIdeal: true,
    color: 'emerald',
    badge: '100% Sempurna — Titik Tujuan Asli'
  },
  tersesat: {
    id: 'tersesat',
    title: 'Zona Labirin Alternatif (Tersesat di Jalur Samping)',
    subtitle: 'Berakhir di Pos Luar / Rute Simpang Labirin',
    description: 'Kamu menyelesaikan 20 soal, namun beberapa jawaban salah membuatmu terbelok dari rute emas utama. Silakan evaluasi titik di mana kamu mulai tersesat dan pelajari pembahasannya.',
    isIdeal: false,
    color: 'amber',
    badge: 'Tersesat dari Titik Tujuan Asli'
  }
};

export function getNextQuestionId(currentQId: number, selectedOption: OptionKey): number | 'SELESAI' {
  const transitions = QUESTION_TRANSITIONS[currentQId];
  if (!transitions) return 'SELESAI';
  return transitions[selectedOption] ?? 'SELESAI';
}

export function isGoldenNode(stepIndex: number, questionId: number): boolean {
  // stepIndex is 1-based (1 to 20)
  return GOLDEN_PATH[stepIndex - 1] === questionId;
}

/**
 * Computes whether the student is currently on the Golden Path,
 * how many consecutive correct answers in branch route they have achieved,
 * and the exact points for each step.
 */
export function computeRouteStateK10(history: StepAnswer[]): {
  isOnGoldenPath: boolean;
  consecutiveBranchCorrect: number;
  totalScore: number;
  goldenCorrectCount: number;
  branchCorrectCount: number;
} {
  let isOnGoldenPath = true;
  let consecutiveBranchCorrect = 0;
  let totalScore = 0;
  let goldenCorrectCount = 0;
  let branchCorrectCount = 0;

  for (let i = 0; i < history.length; i++) {
    const step = history[i];
    if (isOnGoldenPath) {
      if (step.isCorrect) {
        totalScore += 2;
        goldenCorrectCount += 1;
        // Stays on Golden Path
      } else {
        isOnGoldenPath = false;
        consecutiveBranchCorrect = 0;
      }
    } else {
      // In branch route
      if (step.isCorrect) {
        totalScore += 1;
        branchCorrectCount += 1;
        consecutiveBranchCorrect += 1;
        if (consecutiveBranchCorrect >= 2) {
          // Reconnects back to Golden Path for the NEXT step!
          isOnGoldenPath = true;
          consecutiveBranchCorrect = 0;
        }
      } else {
        consecutiveBranchCorrect = 0;
      }
    }
  }

  return {
    isOnGoldenPath,
    consecutiveBranchCorrect,
    totalScore,
    goldenCorrectCount,
    branchCorrectCount
  };
}

/**
 * Determines the next question ID for Kelas 10 based on:
 * 1. Current route state (Golden vs Branch)
 * 2. Whether answer is correct
 * 3. Recovery to Golden Path if 2 consecutive correct answers on branch
 */
export function determineNextQuestionK10(
  currentStep: number, // 1 to 20
  currentQuestionId: number,
  selectedOption: OptionKey,
  isCorrect: boolean,
  currentIsOnGoldenPath: boolean,
  currentConsecutiveBranchCorrect: number
): {
  nextQuestionId: number | 'SELESAI';
  pointsEarned: number;
  willBeOnGoldenPath: boolean;
  nextConsecutiveBranchCorrect: number;
} {
  if (currentStep >= 20) {
    const points = isCorrect ? (currentIsOnGoldenPath ? 2 : 1) : 0;
    return {
      nextQuestionId: 'SELESAI',
      pointsEarned: points,
      willBeOnGoldenPath: currentIsOnGoldenPath,
      nextConsecutiveBranchCorrect: 0
    };
  }

  const nextStepIndex = currentStep + 1;
  const nextGoldenQuestion = GOLDEN_PATH[nextStepIndex - 1];
  const nextLevelList = LEVEL_QUESTIONS[nextStepIndex] || [];
  const fallbackBranchQuestion = nextLevelList.length > 1 ? nextLevelList[1] : (nextLevelList[0] || nextGoldenQuestion);

  if (currentIsOnGoldenPath) {
    if (isCorrect) {
      // Stays on Golden Path -> +2 points
      return {
        nextQuestionId: nextGoldenQuestion,
        pointsEarned: 2,
        willBeOnGoldenPath: true,
        nextConsecutiveBranchCorrect: 0
      };
    } else {
      // Branches to wrong route -> 0 points
      const mappedNext = QUESTION_TRANSITIONS[currentQuestionId]?.[selectedOption];
      const branchQ = (typeof mappedNext === 'number' && mappedNext !== nextGoldenQuestion)
        ? mappedNext
        : fallbackBranchQuestion;

      return {
        nextQuestionId: branchQ,
        pointsEarned: 0,
        willBeOnGoldenPath: false,
        nextConsecutiveBranchCorrect: 0
      };
    }
  } else {
    // Currently on branch route
    if (isCorrect) {
      const newConsecutive = currentConsecutiveBranchCorrect + 1;
      if (newConsecutive >= 2) {
        // RECOVERY TO GOLDEN PATH! Reconnected after 2 correct answers on branch
        return {
          nextQuestionId: nextGoldenQuestion,
          pointsEarned: 1, // Still earned 1 point on this branch question
          willBeOnGoldenPath: true, // But next question will be on Golden Path!
          nextConsecutiveBranchCorrect: 0
        };
      } else {
        // Stays on branch (needs 1 more correct)
        const mappedNext = QUESTION_TRANSITIONS[currentQuestionId]?.[selectedOption];
        const branchQ = (typeof mappedNext === 'number' && mappedNext !== nextGoldenQuestion)
          ? mappedNext
          : fallbackBranchQuestion;

        return {
          nextQuestionId: branchQ,
          pointsEarned: 1,
          willBeOnGoldenPath: false,
          nextConsecutiveBranchCorrect: newConsecutive
        };
      }
    } else {
      // Wrong answer on branch -> 0 points, resets consecutive correct counter
      const mappedNext = QUESTION_TRANSITIONS[currentQuestionId]?.[selectedOption];
      const branchQ = (typeof mappedNext === 'number' && mappedNext !== nextGoldenQuestion)
        ? mappedNext
        : fallbackBranchQuestion;

      return {
        nextQuestionId: branchQ,
        pointsEarned: 0,
        willBeOnGoldenPath: false,
        nextConsecutiveBranchCorrect: 0
      };
    }
  }
}

export interface DivergenceInfo {
  hasDiverged: boolean;
  stepIndex: number;
  questionId: number;
  questionText: string;
  selectedOption: OptionKey;
  correctOption: OptionKey;
  expectedNextQuestionId: number;
  actualNextQuestionId: number | 'SELESAI';
}

export function findDivergencePoint(
  history: Array<{
    stepIndex: number;
    questionId: number;
    selectedOption: OptionKey;
    isCorrect: boolean;
    nextQuestionId: number | 'SELESAI';
  }>
): DivergenceInfo | null {
  const firstWrong = history.find(h => !h.isCorrect);
  if (!firstWrong) return null;

  const q = QUESTIONS_DATA[firstWrong.questionId];
  const expectedNext = firstWrong.stepIndex < 20 ? GOLDEN_PATH[firstWrong.stepIndex] : 'SELESAI';

  return {
    hasDiverged: true,
    stepIndex: firstWrong.stepIndex,
    questionId: firstWrong.questionId,
    questionText: q?.question || '',
    selectedOption: firstWrong.selectedOption,
    correctOption: q?.correctAnswer || 'A',
    expectedNextQuestionId: typeof expectedNext === 'number' ? expectedNext : 1,
    actualNextQuestionId: firstWrong.nextQuestionId
  };
}
