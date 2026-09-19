import { OptionKey, StepAnswer } from '../types/exam';
import { QUESTIONS_DATA_K12 } from './questionsDataK12';

// 20 steps Golden Path for Grade 12 (Enzim & Metabolisme Sel)
export const GOLDEN_PATH_K12: number[] = [
  3, 4, 7, 8, 9, 11, 12, 14, 15, 16, 17, 19, 21, 22, 28, 29, 32, 33, 37, 40
];

// Mapping of questions per level / step
export const LEVEL_QUESTIONS_K12: Record<number, number[]> = {
  1: [3, 1, 2],
  2: [4, 5, 6],
  3: [7, 2, 6],
  4: [8, 10, 6],
  5: [9, 10, 13],
  6: [11, 13, 18],
  7: [12, 13, 10],
  8: [14, 18, 13],
  9: [15, 18, 20],
  10: [16, 20, 18],
  11: [17, 20, 23],
  12: [19, 23, 20],
  13: [21, 24, 25],
  14: [22, 26, 27],
  15: [28, 27, 30],
  16: [29, 30, 31],
  17: [32, 31, 34],
  18: [33, 35, 36],
  19: [37, 38, 39],
  20: [40, 39, 38]
};

// Deterministic transitions for Grade 12 (40 questions in total)
export const QUESTION_TRANSITIONS_K12: Record<number, Record<OptionKey, number | 'SELESAI'>> = {
  // Step 1: Golden Q3 (Key: B)
  3: {
    B: 4, // Correct -> Golden Step 2
    A: 1, // Incorrect -> Branch Q1
    C: 2, // Incorrect -> Branch Q2
    D: 1, // Incorrect -> Branch Q1
    E: 2  // Incorrect -> Branch Q2
  },
  1: {
    A: 4, // Correct -> reconnects towards Level 2 Golden
    B: 5, // Incorrect -> Branch Q5
    C: 5,
    D: 5,
    E: 5
  },
  2: {
    B: 4, // Correct -> Level 2 Golden
    A: 5,
    C: 5,
    D: 5,
    E: 5
  },

  // Step 2: Golden Q4 (Key: C)
  4: {
    C: 7, // Correct -> Golden Step 3
    A: 5, // Incorrect -> Branch Q5
    B: 6, // Incorrect -> Branch Q6
    D: 5,
    E: 6
  },
  5: {
    A: 7, // Correct -> Level 3 Golden
    B: 6,
    C: 6,
    D: 6,
    E: 6
  },
  6: {
    B: 7, // Correct -> Level 3 Golden
    A: 10,
    C: 10,
    D: 10,
    E: 10
  },

  // Step 3: Golden Q7 (Key: B)
  7: {
    B: 8, // Correct -> Golden Step 4
    A: 6,
    C: 6,
    D: 10,
    E: 10
  },

  // Step 4: Golden Q8 (Key: A)
  8: {
    A: 9, // Correct -> Golden Step 5
    B: 10,
    C: 10,
    D: 6,
    E: 10
  },
  10: {
    A: 9, // Correct -> Level 5 Golden
    B: 13,
    C: 13,
    D: 13,
    E: 13
  },

  // Step 5: Golden Q9 (Key: D)
  9: {
    D: 11, // Correct -> Golden Step 6
    A: 10,
    B: 13,
    C: 10,
    E: 13
  },

  // Step 6: Golden Q11 (Key: A)
  11: {
    A: 12, // Correct -> Golden Step 7
    B: 13,
    C: 13,
    D: 13,
    E: 13
  },
  13: {
    C: 12, // Correct -> Level 7 Golden
    A: 18,
    B: 18,
    D: 18,
    E: 18
  },

  // Step 7: Golden Q12 (Key: B)
  12: {
    B: 14, // Correct -> Golden Step 8
    A: 13,
    C: 13,
    D: 18,
    E: 18
  },

  // Step 8: Golden Q14 (Key: B)
  14: {
    B: 15, // Correct -> Golden Step 9
    A: 18,
    C: 18,
    D: 13,
    E: 18
  },
  18: {
    A: 15, // Correct -> Level 9 Golden
    B: 20,
    C: 20,
    D: 20,
    E: 20
  },

  // Step 9: Golden Q15 (Key: C)
  15: {
    C: 16, // Correct -> Golden Step 10
    A: 18,
    B: 20,
    D: 18,
    E: 20
  },
  20: {
    C: 16, // Correct -> Level 10 Golden
    A: 23,
    B: 23,
    D: 23,
    E: 23
  },

  // Step 10: Golden Q16 (Key: A)
  16: {
    A: 17, // Correct -> Golden Step 11
    B: 20,
    C: 18,
    D: 20,
    E: 18
  },

  // Step 11: Golden Q17 (Key: C)
  17: {
    C: 19, // Correct -> Golden Step 12
    A: 20,
    B: 23,
    D: 20,
    E: 23
  },
  23: {
    A: 19, // Correct -> Level 12 Golden
    B: 24,
    C: 24,
    D: 24,
    E: 24
  },

  // Step 12: Golden Q19 (Key: B)
  19: {
    B: 21, // Correct -> Golden Step 13
    A: 23,
    C: 23,
    D: 24,
    E: 24
  },

  // Step 13: Golden Q21 (Key: A)
  21: {
    A: 22, // Correct -> Golden Step 14
    B: 24,
    C: 25,
    D: 24,
    E: 25
  },
  24: {
    B: 22, // Correct -> Level 14 Golden
    A: 25,
    C: 25,
    D: 26,
    E: 26
  },
  25: {
    C: 22, // Correct -> Level 14 Golden
    A: 26,
    B: 26,
    D: 26,
    E: 26
  },

  // Step 14: Golden Q22 (Key: B)
  22: {
    B: 28, // Correct -> Golden Step 15
    A: 26,
    C: 27,
    D: 26,
    E: 27
  },
  26: {
    A: 28, // Correct -> Level 15 Golden
    B: 27,
    C: 27,
    D: 30,
    E: 30
  },
  27: {
    C: 28, // Correct -> Level 15 Golden
    A: 30,
    B: 30,
    D: 30,
    E: 30
  },

  // Step 15: Golden Q28 (Key: A)
  28: {
    A: 29, // Correct -> Golden Step 16
    B: 30,
    C: 27,
    D: 30,
    E: 27
  },
  30: {
    A: 29, // Correct -> Level 16 Golden
    B: 31,
    C: 31,
    D: 31,
    E: 31
  },

  // Step 16: Golden Q29 (Key: B)
  29: {
    B: 32, // Correct -> Golden Step 17
    A: 31,
    C: 30,
    D: 31,
    E: 30
  },
  31: {
    B: 32, // Correct -> Level 17 Golden
    A: 34,
    C: 34,
    D: 34,
    E: 34
  },

  // Step 17: Golden Q32 (Key: B)
  32: {
    B: 33, // Correct -> Golden Step 18
    A: 34,
    C: 31,
    D: 34,
    E: 31
  },
  34: {
    B: 33, // Correct -> Level 18 Golden
    A: 35,
    C: 35,
    D: 35,
    E: 35
  },

  // Step 18: Golden Q33 (Key: C)
  33: {
    C: 37, // Correct -> Golden Step 19
    A: 35,
    B: 36,
    D: 35,
    E: 36
  },
  35: {
    A: 37, // Correct -> Level 19 Golden
    B: 36,
    C: 36,
    D: 38,
    E: 38
  },
  36: {
    C: 37, // Correct -> Level 19 Golden
    A: 38,
    B: 38,
    D: 38,
    E: 38
  },

  // Step 19: Golden Q37 (Key: C)
  37: {
    C: 40, // Correct -> Golden Step 20
    A: 38,
    B: 39,
    D: 38,
    E: 39
  },
  38: {
    A: 40, // Correct -> Level 20 Final
    B: 39,
    C: 39,
    D: 39,
    E: 39
  },
  39: {
    B: 40, // Correct -> Level 20 Final
    A: 40,
    C: 40,
    D: 40,
    E: 40
  },

  // Step 20 (Final Step -> all options finish the exam)
  40: {
    A: 'SELESAI',
    B: 'SELESAI',
    C: 'SELESAI',
    D: 'SELESAI',
    E: 'SELESAI'
  }
};

export function getNextQuestionIdK12(currentQId: number, selectedOption: OptionKey): number | 'SELESAI' {
  const transitions = QUESTION_TRANSITIONS_K12[currentQId];
  if (!transitions) return 'SELESAI';
  return transitions[selectedOption] ?? 'SELESAI';
}

export function isGoldenNodeK12(stepIndex: number, questionId: number): boolean {
  return GOLDEN_PATH_K12[stepIndex - 1] === questionId;
}

export function computeRouteStateK12(history: StepAnswer[]): {
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
        totalScore += 2; // 2 points for correct on Golden Path
        goldenCorrectCount += 1;
      } else {
        isOnGoldenPath = false;
        consecutiveBranchCorrect = 0;
      }
    } else {
      if (step.isCorrect) {
        totalScore += 1; // 1 point for correct on Branch
        branchCorrectCount += 1;
        consecutiveBranchCorrect += 1;
        if (consecutiveBranchCorrect >= 2) {
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

export function determineNextQuestionK12(
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
  const nextGoldenQuestion = GOLDEN_PATH_K12[nextStepIndex - 1];
  const nextLevelList = LEVEL_QUESTIONS_K12[nextStepIndex] || [];
  const fallbackBranchQuestion = nextLevelList.length > 1 ? nextLevelList[1] : (nextLevelList[0] || nextGoldenQuestion);

  if (currentIsOnGoldenPath) {
    if (isCorrect) {
      return {
        nextQuestionId: nextGoldenQuestion,
        pointsEarned: 2,
        willBeOnGoldenPath: true,
        nextConsecutiveBranchCorrect: 0
      };
    } else {
      const mappedNext = QUESTION_TRANSITIONS_K12[currentQuestionId]?.[selectedOption];
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
    if (isCorrect) {
      const newConsecutive = currentConsecutiveBranchCorrect + 1;
      if (newConsecutive >= 2) {
        // Reconnection back to Golden Path!
        return {
          nextQuestionId: nextGoldenQuestion,
          pointsEarned: 1, // Still 1 point for this branch question
          willBeOnGoldenPath: true,
          nextConsecutiveBranchCorrect: 0
        };
      } else {
        const mappedNext = QUESTION_TRANSITIONS_K12[currentQuestionId]?.[selectedOption];
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
      const mappedNext = QUESTION_TRANSITIONS_K12[currentQuestionId]?.[selectedOption];
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
