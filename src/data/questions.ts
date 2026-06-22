// ============================================================
// BACKWARD COMPATIBILITY — Re-exports from new structure
// All imports from "@/data/questions" will continue to work.
// ============================================================
export type { Question, Subject, VisualData } from "./questions/types";
export { subjects, questionsBySubject, testsBySubject, getTestQuestions, getSubjectTestInfo } from "./questions/index";
