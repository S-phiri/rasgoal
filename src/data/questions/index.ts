// ============================================================
// CENTRAL QUESTION INDEX
// ============================================================
// This file registers all subjects and their question tests.
// To add a new subject:
// 1. Create a new file in src/data/questions/ (copy any existing one)
// 2. Import the tests here
// 3. Add the subject to the `subjects` array
// 4. Add the tests to `testsBySubject`
// ============================================================

export type { Question, Subject, SubjectTests, VisualData } from "./types";
export { createEmptyTests } from "./types";

import { mathematicsTests } from "./mathematics";
import { scienceTests } from "./science";
import { englishTests } from "./english";
import { socialStudiesTests } from "./social-studies";
import { specialPaper1Tests } from "./special-paper-1";
import { specialPaper2Tests } from "./special-paper-2";
import { creativeTechnologyTests } from "./creative-technology";
import type { Subject, SubjectTests } from "./types";

// ============================================================
// SUBJECTS — Add new subjects here
// ============================================================
export const subjects: Subject[] = [
  { id: "math", name: "Mathematics", icon: "📐", description: "Algebra, Geometry, Fractions & more", color: "primary" },
  { id: "science", name: "Science", icon: "🔬", description: "Physics, Chemistry, Biology basics", color: "accent" },
  { id: "english", name: "English", icon: "📖", description: "Grammar, Vocabulary, Comprehension", color: "secondary" },
  { id: "social-studies", name: "Social Studies", icon: "🏛️", description: "History, Geography, Civics", color: "destructive" },
  { id: "special-paper-1", name: "Special Paper 1", icon: "📝", description: "Special examination paper 1", color: "success" },
  { id: "special-paper-2", name: "Special Paper 2", icon: "📋", description: "Special examination paper 2", color: "primary" },
  { id: "creative-technology", name: "Creative & Technology Studies", icon: "💻", description: "Art, Design, and Technology", color: "accent" },
];

// ============================================================
// TESTS BY SUBJECT — Maps subject IDs to their 10 tests
// ============================================================
export const testsBySubject: Record<string, SubjectTests> = {
  math: mathematicsTests,
  science: scienceTests,
  english: englishTests,
  "social-studies": socialStudiesTests,
  "special-paper-1": specialPaper1Tests,
  "special-paper-2": specialPaper2Tests,
  "creative-technology": creativeTechnologyTests,
};

// ============================================================
// HELPER: Get questions for a specific subject + test number
// testNumber is 1-based (1-10)
// ============================================================
export function getTestQuestions(subjectId: string, testNumber: number) {
  const tests = testsBySubject[subjectId];
  if (!tests) return [];
  const index = testNumber - 1;
  if (index < 0 || index >= tests.length) return [];
  return tests[index];
}

// ============================================================
// HELPER: Get test availability info for a subject
// ============================================================
export function getSubjectTestInfo(subjectId: string) {
  const tests = testsBySubject[subjectId];
  if (!tests) return [];
  return tests.map((t, i) => ({
    testNumber: i + 1,
    questionCount: t.length,
    isAvailable: t.length > 0,
  }));
}

// ============================================================
// BACKWARD COMPATIBILITY — flat question map (all Test 1s)
// Used by existing progress tracking. Do not remove.
// ============================================================
export const questionsBySubject: Record<string, import("./types").Question[]> = {};
for (const subject of subjects) {
  const tests = testsBySubject[subject.id];
  if (tests) {
    // Flatten all tests for backward compat with progress tracking
    questionsBySubject[subject.id] = tests.flat();
  }
}
