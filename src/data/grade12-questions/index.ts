export type { Question, VisualData } from "../questions/types";
export type { Grade12Subject, SubjectTests } from "./types";
export { createEmptyTests } from "./types";

import { mathematicsTests } from "./mathematics";
import { englishTests } from "./english";
import { biologyTests } from "./biology";
import { physicsTests } from "./physics";
import { chemistryTests } from "./chemistry";
import { geographyTests } from "./geography";
import { historyTests } from "./history";
import { civicEducationTests } from "./civic-education";
import { commerceTests } from "./commerce";
import { computerStudiesTests } from "./computer-studies";
import { religiousEducationTests } from "./religious-education";
import { principlesOfAccountsTests } from "./principles-of-accounts";
import type { Grade12Subject, SubjectTests } from "./types";

export const grade12Subjects: Grade12Subject[] = [
  { id: "g12-math", name: "Mathematics", icon: "📐", description: "Calculus, Algebra, Trigonometry & Statistics", color: "primary" },
  { id: "g12-english", name: "English Language", icon: "📖", description: "Comprehension, Grammar, Essay Writing", color: "secondary" },
  { id: "g12-biology", name: "Biology", icon: "🧬", description: "Cell Biology, Genetics, Ecology", color: "accent" },
  { id: "g12-physics", name: "Physics", icon: "⚡", description: "Mechanics, Electricity, Waves & Optics", color: "destructive" },
  { id: "g12-chemistry", name: "Chemistry", icon: "🧪", description: "Organic, Inorganic & Physical Chemistry", color: "success" },
  { id: "g12-geography", name: "Geography", icon: "🌍", description: "Physical & Human Geography", color: "primary" },
  { id: "g12-history", name: "History", icon: "📜", description: "Zambian, African & World History", color: "accent" },
  { id: "g12-civic", name: "Civic Education", icon: "🏛️", description: "Governance, Rights & Responsibilities", color: "secondary" },
  { id: "g12-commerce", name: "Commerce", icon: "💼", description: "Business, Trade & Economics", color: "destructive" },
  { id: "g12-computer", name: "Computer Studies", icon: "💻", description: "Programming, Networking & Systems", color: "success" },
  { id: "g12-re", name: "Religious Education", icon: "📿", description: "Ethics, Morality & World Religions", color: "primary" },
  { id: "g12-poa", name: "Principles of Accounts", icon: "📊", description: "Bookkeeping, Ledgers & Financial Statements", color: "secondary" },
];

export const grade12TestsBySubject: Record<string, SubjectTests> = {
  "g12-math": mathematicsTests,
  "g12-english": englishTests,
  "g12-biology": biologyTests,
  "g12-physics": physicsTests,
  "g12-chemistry": chemistryTests,
  "g12-geography": geographyTests,
  "g12-history": historyTests,
  "g12-civic": civicEducationTests,
  "g12-commerce": commerceTests,
  "g12-computer": computerStudiesTests,
  "g12-re": religiousEducationTests,
  "g12-poa": principlesOfAccountsTests,
};

export function getGrade12TestQuestions(subjectId: string, testNumber: number) {
  const tests = grade12TestsBySubject[subjectId];
  if (!tests) return [];
  const index = testNumber - 1;
  if (index < 0 || index >= 10) return [];
  return tests[index];
}

export function getGrade12SubjectTestInfo(subjectId: string) {
  const tests = grade12TestsBySubject[subjectId];
  if (!tests) return [];
  return tests.map((t, i) => ({
    testNumber: i + 1,
    questionCount: t.length,
    isAvailable: t.length > 0,
  }));
}
