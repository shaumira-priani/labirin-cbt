// src/utils/mazeGraphGenerator.ts
//
// Turns a flat, teacher-uploaded question list into a branching "labirin"
// graph — same golden-path/branch/recovery concept as the two built-in maze
// quizzes (Kehati & Metabolisme), generated automatically instead of
// hand-authored.
//
// - First ~60% of questions (upload order) = GOLDEN PATH.
// - Remaining ~40% = BRANCH POOL, reused as remedial detours.
// - Wrong on a golden question -> sent to a branch question, PREFERRING one
//   with the same `topic` (real remediation). Falls back round-robin.
// - The RUNNER (CustomExamRunner.tsx) enforces "2 correct in a row on branch
//   questions to reconnect" — this file only provides the static wrong-answer
//   routing (`wrongAnswerTarget`) plus `goldenPath`/`branchPool` for the
//   runner to walk dynamically. It does not hardcode the recovery count.
// - Scoring: golden correct = 2 pts, branch correct = 1 pt, wrong = 0 pt.

import type { CustomQuestionDoc } from '../types/customExam';
import type { OptionKey } from '../types/exam';

export interface MazeGraph {
  goldenPath: string[]; // question IDs, in order
  branchPool: string[]; // question IDs used as remedial detours
  /** Where to send the student when they answer WRONG on this question id. */
  wrongAnswerTarget: Record<string, Partial<Record<OptionKey, string>>>;
}

const MIN_QUESTIONS_FOR_MAZE = 6;
const GOLDEN_RATIO = 0.6;

export function generateMazeGraph(
  questions: CustomQuestionDoc[],
  goldenPathCountOverride?: number,
  explicitGoldenOrders?: number[]
): MazeGraph {
  const ordered = [...questions].sort((a, b) => a.order - b.order);

  if (ordered.length < MIN_QUESTIONS_FOR_MAZE) {
    // Too few questions for a real branch pool — reuse the same list as both
    // golden path and branch pool (a wrong answer just detours to the next
    // question in the list rather than a dedicated remedial question).
    const ids = ordered.map((q) => q.id);
    const wrongAnswerTarget: MazeGraph['wrongAnswerTarget'] = {};
    ordered.forEach((q, i) => {
      const detour = ids[(i + 1) % ids.length];
      wrongAnswerTarget[q.id] = Object.fromEntries(
        q.options.filter((o) => o.key !== q.correctAnswer).map((o) => [o.key, detour])
      );
    });
    return { goldenPath: ids, branchPool: ids, wrongAnswerTarget };
  }

  const validExplicit =
    explicitGoldenOrders && explicitGoldenOrders.length >= 3 && explicitGoldenOrders.length <= ordered.length - 2
      ? explicitGoldenOrders
      : null;

  let golden: CustomQuestionDoc[];
  let branch: CustomQuestionDoc[];

  if (validExplicit) {
    const orderSet = new Set(validExplicit);
    golden = ordered.filter((q) => orderSet.has(q.order)).sort((a, b) => a.order - b.order);
    branch = ordered.filter((q) => !orderSet.has(q.order));
  } else {
    const autoCount = Math.max(4, Math.round(ordered.length * GOLDEN_RATIO));
    const goldenCount =
      goldenPathCountOverride && goldenPathCountOverride >= 3 && goldenPathCountOverride <= ordered.length - 2
        ? goldenPathCountOverride
        : autoCount;
    golden = ordered.slice(0, goldenCount);
    branch = ordered.slice(goldenCount);
  }

  const goldenPath = golden.map((q) => q.id);
  const branchPool = branch.map((q) => q.id);

  const wrongAnswerTarget: MazeGraph['wrongAnswerTarget'] = {};
  let cursor = 0;

  const pickBranchIdFor = (topic?: string): string => {
    const sameTopic = topic ? branch.filter((b) => b.topic === topic) : [];
    const pool = sameTopic.length > 0 ? sameTopic : branch;
    const picked = pool[cursor % pool.length];
    cursor++;
    return picked.id;
  };

  // Golden questions: wrong answers detour into the branch pool (topic-matched when possible)
  golden.forEach((q) => {
    wrongAnswerTarget[q.id] = Object.fromEntries(
      q.options.filter((o) => o.key !== q.correctAnswer).map((o) => [o.key, pickBranchIdFor(q.topic)])
    );
  });

  // Branch questions: wrong answers detour to another branch question (stays in remedial pool)
  branch.forEach((q, i) => {
    const fallback = branchPool[(i + 1) % branchPool.length];
    wrongAnswerTarget[q.id] = Object.fromEntries(
      q.options.filter((o) => o.key !== q.correctAnswer).map((o) => [o.key, fallback])
    );
  });

  return { goldenPath, branchPool, wrongAnswerTarget };
}

/** Golden correct = 2, branch correct = 1, wrong = 0. */
export function pointsFor(isCorrect: boolean, isOnGoldenPath: boolean): number {
  if (!isCorrect) return 0;
  return isOnGoldenPath ? 2 : 1;
}
