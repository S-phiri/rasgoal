import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { subjects, questionsBySubject } from "@/data/questions";

export interface SubjectProgressData {
  subjectId: string;
  totalAvailable: number;
  bestScore: number;
  totalCorrect: number;
  quizzesTaken: number;
  progress: number; // 0-1
}

export function useSubjectProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, SubjectProgressData>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;

    const { data: history } = await supabase
      .from("quiz_history")
      .select("subject, score, total_questions, exam_number")
      .eq("user_id", user.id);

    const result: Record<string, SubjectProgressData> = {};

    for (const subject of subjects) {
      const totalAvailable = questionsBySubject[subject.id]?.length || 50;
      const subjectHistory = (history || []).filter((h: any) => h.subject === subject.id);

      // Keep only the best score per unique completed test (exam_number).
      // This ensures the meter only advances when NEW tests are completed,
      // not when the same test is retaken.
      const bestPerTest = new Map<number, number>();
      subjectHistory.forEach((h: any) => {
        const prev = bestPerTest.get(h.exam_number) ?? 0;
        if (h.score > prev) bestPerTest.set(h.exam_number, h.score);
      });

      const totalCorrect = Array.from(bestPerTest.values()).reduce((sum, s) => sum + s, 0);
      const bestScore = bestPerTest.size > 0 ? Math.max(...bestPerTest.values()) : 0;

      result[subject.id] = {
        subjectId: subject.id,
        totalAvailable,
        bestScore,
        totalCorrect,
        quizzesTaken: bestPerTest.size,
        progress: Math.min(totalCorrect / totalAvailable, 1),
      };
    }

    setProgress(result);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, refetch: fetchProgress };
}
