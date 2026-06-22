// ============================================================
// QUESTION & SUBJECT TYPES
// These types define the structure for all quiz content.
// Do NOT modify these unless you're changing the overall format.
// ============================================================

export interface VisualData {
  type: 'sequence' | 'oddOneOut' | 'patternGrid' | 'analogy' | 'mirror' | 'counting' | 'rotation' | 'matching';
  items: string[];           // shape descriptors e.g. "circle", "square:e", "triangle:g:90"
  options?: string[][];      // visual answer options (4 arrays)
  cols?: number;             // grid columns
  missing?: number;          // missing item index
  target?: string;           // for counting: which shape to count
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  tip: string;
  visual?: VisualData;
  image?: string;
  /** Optional reading passage shown above the question (e.g. for comprehension). */
  passage?: string;
  /** Optional title for the passage panel. */
  passageTitle?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

/**
 * Each subject contains a variable number of tests.
 * Each test should have up to 50 questions.
 * Tests with 0 questions will show a "coming soon" message.
 */
export type SubjectTests = Question[][];

/**
 * Helper to create a valid SubjectTests array with 10 empty test slots.
 * Use this when starting a new subject file.
 */
export function createEmptyTests(): SubjectTests {
  return [[], [], [], [], [], [], [], [], [], []];
}
