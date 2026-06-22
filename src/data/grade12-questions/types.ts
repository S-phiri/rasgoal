// Grade 12 question types — reuses the same structure as Grade 7
export type { Question, VisualData } from "../questions/types";

export interface Grade12Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

/**
 * Each subject contains a variable number of tests.
 */
export type SubjectTests = import("../questions/types").Question[][];

export function createEmptyTests(): SubjectTests {
  return [[], [], [], [], [], [], [], [], [], []];
}
