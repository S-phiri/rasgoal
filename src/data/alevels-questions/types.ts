export type { Question, VisualData } from "../questions/types";

export interface AlevelsSubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export type SubjectTests = import("../questions/types").Question[][];

export function createEmptyTests(): SubjectTests {
  return [[], [], [], [], [], [], [], [], [], []];
}
