export type { Question, VisualData } from "../questions/types";
export type { AlevelsSubject, SubjectTests } from "./types";
export { createEmptyTests } from "./types";

import { createEmptyTests, type AlevelsSubject, type SubjectTests } from "./types";

export const alevelsSubjects: AlevelsSubject[] = [
  { id: "al-math", name: "Mathematics", icon: "📐", description: "Pure Math, Mechanics & Statistics", color: "primary" },
  { id: "al-further-math", name: "Further Mathematics", icon: "🧮", description: "Advanced Pure, Mechanics & Statistics", color: "secondary" },
  { id: "al-english", name: "English Literature", icon: "📖", description: "Poetry, Prose & Drama", color: "accent" },
  { id: "al-biology", name: "Biology", icon: "🧬", description: "Cells, Genetics & Physiology", color: "success" },
  { id: "al-physics", name: "Physics", icon: "⚡", description: "Mechanics, Fields, Quantum & Nuclear", color: "destructive" },
  { id: "al-chemistry", name: "Chemistry", icon: "🧪", description: "Organic, Inorganic & Physical Chemistry", color: "primary" },
  { id: "al-geography", name: "Geography", icon: "🌍", description: "Physical & Human Geography", color: "accent" },
  { id: "al-history", name: "History", icon: "📜", description: "Modern World & African History", color: "secondary" },
  { id: "al-economics", name: "Economics", icon: "💹", description: "Micro & Macroeconomics", color: "destructive" },
  { id: "al-business", name: "Business Studies", icon: "💼", description: "Management, Marketing & Finance", color: "success" },
  { id: "al-computer", name: "Computer Science", icon: "💻", description: "Algorithms, Architecture & Programming", color: "primary" },
  { id: "al-accounting", name: "Accounting", icon: "📊", description: "Financial & Management Accounting", color: "secondary" },
];

export const alevelsTestsBySubject: Record<string, SubjectTests> = Object.fromEntries(
  alevelsSubjects.map((s) => [s.id, createEmptyTests()])
);

export function getAlevelsTestQuestions(subjectId: string, testNumber: number) {
  const tests = alevelsTestsBySubject[subjectId];
  if (!tests) return [];
  const index = testNumber - 1;
  if (index < 0 || index >= 10) return [];
  return tests[index];
}

export function getAlevelsSubjectTestInfo(subjectId: string) {
  const tests = alevelsTestsBySubject[subjectId];
  if (!tests) return [];
  return tests.map((t, i) => ({
    testNumber: i + 1,
    questionCount: t.length,
    isAvailable: t.length > 0,
  }));
}
