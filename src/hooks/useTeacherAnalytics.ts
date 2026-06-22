import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StudentQuizRecord {
  user_id: string;
  subject: string;
  exam_number: number;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export interface StudentAttemptRecord {
  user_id: string;
  subject: string;
  question_id: string;
  first_attempt_correct: boolean;
  final_correct: boolean;
  attempts: number;
  exam_number: number;
  created_at: string;
  selected_answer: number | null;
}

export interface StudentProfile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  grade: string | null;
  school: string | null;
}

export const useTeacherAnalytics = (studentIds: string[]) => {
  const { user } = useAuth();
  const [quizHistory, setQuizHistory] = useState<StudentQuizRecord[]>([]);
  const [questionAttempts, setQuestionAttempts] = useState<StudentAttemptRecord[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<Map<string, StudentProfile>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user || studentIds.length === 0) {
      setQuizHistory([]);
      setQuestionAttempts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [quizRes, attemptsRes, profilesRes] = await Promise.all([
      supabase
        .from("quiz_history")
        .select("user_id, subject, exam_number, score, total_questions, percentage, completed_at")
        .in("user_id", studentIds),
      supabase
        .from("question_attempts")
        .select("user_id, subject, question_id, first_attempt_correct, final_correct, attempts, exam_number, created_at, selected_answer")
        .in("user_id", studentIds),
      supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url, grade, school")
        .in("user_id", studentIds),
    ]);

    setQuizHistory((quizRes.data as StudentQuizRecord[]) || []);
    setQuestionAttempts((attemptsRes.data as StudentAttemptRecord[]) || []);

    const pMap = new Map<string, StudentProfile>();
    (profilesRes.data || []).forEach((p: any) => pMap.set(p.user_id, p));
    setStudentProfiles(pMap);

    setLoading(false);
  }, [user, studentIds.join(",")]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { quizHistory, questionAttempts, studentProfiles, loading, refetch: fetchData };
};
