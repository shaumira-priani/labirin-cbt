// src/utils/mazeStateMachine.ts
//
// The exact same transition rules used live in CustomExamRunner, extracted
// into a pure function so we can REPLAY a student's past answers (from
// Firestore) to reconstruct exactly where they were — this is what makes
// "resume after device dies" possible without duplicating the maze logic.

import type { MazeGraph } from './mazeGraphGenerator';
import type { OptionKey } from '../types/exam';

export interface AnswerRecord {
  questionId: string;
  selectedOption: OptionKey;
  isCorrect: boolean;
  isOnGoldenPath: boolean;
  pointsEarned: number;
}

export interface MazeState {
  currentId: string | 'SELESAI';
  arrayPointer: number;
  remainingBudget: number;
  isOnGoldenPath: boolean;
  consecutiveBranchCorrect: number;
}

export interface Snapshot {
  questionId: string;
  arrayPointer: number;
  remainingBudget: number;
  isOnGoldenPath: boolean;
  consecutiveBranchCorrect: number;
  selectedOption: OptionKey;
}

const RECOVERY_STREAK_NEEDED = 2;

export function initialMazeState(graph: MazeGraph): MazeState {
  return {
    currentId: graph.goldenPath[0] ?? 'SELESAI',
    arrayPointer: 0,
    remainingBudget: graph.goldenPath.length,
    isOnGoldenPath: true,
    consecutiveBranchCorrect: 0,
  };
}

function pickAnotherBranchQuestion(graph: MazeGraph, excludeId: string): string {
  const pool = graph.branchPool;
  if (pool.length <= 1) return pool[0] ?? excludeId;
  let idx = pool.indexOf(excludeId);
  idx = (idx + 1) % pool.length;
  if (pool[idx] === excludeId) idx = (idx + 1) % pool.length;
  return pool[idx];
}

/** Advances the state machine by exactly one answered question. */
export function transition(graph: MazeGraph, state: MazeState, questionId: string, selected: OptionKey, isCorrect: boolean): MazeState {
  const nextBudget = state.remainingBudget - 1;
  let nextId: string | 'SELESAI';
  let nextIsOnGolden = state.isOnGoldenPath;
  let nextConsecutive = state.consecutiveBranchCorrect;
  let nextPointer = state.arrayPointer;

  if (state.isOnGoldenPath) {
    nextConsecutive = 0;
    if (isCorrect) {
      nextPointer = state.arrayPointer + 1;
      const arrayExhausted = nextPointer >= graph.goldenPath.length;
      if (nextBudget <= 0 || arrayExhausted) {
        nextId = 'SELESAI';
      } else {
        nextIsOnGolden = true;
        nextId = graph.goldenPath[nextPointer];
      }
    } else {
      nextPointer = state.arrayPointer + 1;
      if (nextBudget <= 0) {
        nextId = 'SELESAI';
      } else {
        nextIsOnGolden = false;
        nextId = graph.wrongAnswerTarget[questionId]?.[selected] ?? graph.branchPool[0];
      }
    }
  } else {
    nextPointer = state.arrayPointer;
    if (isCorrect) {
      nextConsecutive = state.consecutiveBranchCorrect + 1;
      if (nextConsecutive >= RECOVERY_STREAK_NEEDED) {
        nextConsecutive = 0;
        const arrayExhausted = state.arrayPointer >= graph.goldenPath.length;
        if (nextBudget <= 0 || arrayExhausted) {
          nextId = 'SELESAI';
        } else {
          nextIsOnGolden = true;
          nextId = graph.goldenPath[state.arrayPointer];
        }
      } else if (nextBudget <= 0) {
        nextId = 'SELESAI';
      } else {
        nextIsOnGolden = false;
        nextId = pickAnotherBranchQuestion(graph, questionId);
      }
    } else {
      nextConsecutive = 0;
      if (nextBudget <= 0) {
        nextId = 'SELESAI';
      } else {
        nextIsOnGolden = false;
        nextId = graph.wrongAnswerTarget[questionId]?.[selected] ?? pickAnotherBranchQuestion(graph, questionId);
      }
    }
  }

  return { currentId: nextId, arrayPointer: nextPointer, remainingBudget: nextBudget, isOnGoldenPath: nextIsOnGolden, consecutiveBranchCorrect: nextConsecutive };
}

/** Replays a student's saved answer history to reconstruct exactly where
 *  they left off — used to resume a session after a device drops mid-exam. */
export function replayHistory(graph: MazeGraph, history: AnswerRecord[]): { state: MazeState; pathStack: Snapshot[] } {
  let state = initialMazeState(graph);
  const pathStack: Snapshot[] = [];

  for (const h of history) {
    pathStack.push({
      questionId: h.questionId,
      arrayPointer: state.arrayPointer,
      remainingBudget: state.remainingBudget,
      isOnGoldenPath: state.isOnGoldenPath,
      consecutiveBranchCorrect: state.consecutiveBranchCorrect,
      selectedOption: h.selectedOption,
    });
    state = transition(graph, state, h.questionId, h.selectedOption, h.isCorrect);
  }

  return { state, pathStack };
}
