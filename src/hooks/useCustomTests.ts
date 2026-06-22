import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CustomTest {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  questionCount?: number;
  assignmentCount?: number;
  submissionCount?: number;
}

export interface CustomTestQuestion {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_answer?: number;
  image_url: string | null;
  display_order: number;
}

export interface TestAssignment {
  id: string;
  test_id: string;
  student_id: string;
  status: string;
  due_date: string | null;
  assigned_at: string;
  test?: CustomTest;
  questions?: CustomTestQuestion[];
}

export interface TestSubmission {
  id: string;
  assignment_id: string;
  test_id: string;
  student_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  submitted_at: string;
}

export interface TestSubmissionAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  selected_answer: number;
  is_correct: boolean;
}

export const useCustomTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<CustomTest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("custom_tests")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      // Get counts
      const testsWithCounts = await Promise.all(
        data.map(async (test: any) => {
          const [qRes, aRes, sRes] = await Promise.all([
            supabase.from("custom_test_questions").select("id", { count: "exact", head: true }).eq("test_id", test.id),
            supabase.from("test_assignments").select("id", { count: "exact", head: true }).eq("test_id", test.id),
            supabase.from("test_submissions").select("id", { count: "exact", head: true }).eq("test_id", test.id),
          ]);
          return {
            ...test,
            questionCount: qRes.count || 0,
            assignmentCount: aRes.count || 0,
            submissionCount: sRes.count || 0,
          };
        })
      );
      setTests(testsWithCounts);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const createTest = async (title: string, description?: string, subject?: string) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("custom_tests")
      .insert({ teacher_id: user.id, title, description: description || null, subject: subject || null })
      .select()
      .single();
    if (error) throw error;
    await fetchTests();
    return data;
  };

  const updateTest = async (id: string, updates: { title?: string; description?: string; subject?: string; status?: string }) => {
    const { error } = await supabase.from("custom_tests").update(updates).eq("id", id);
    if (error) throw error;
    await fetchTests();
  };

  const deleteTest = async (id: string) => {
    const { error } = await supabase.from("custom_tests").delete().eq("id", id);
    if (error) throw error;
    await fetchTests();
  };

  const getQuestions = async (testId: string): Promise<CustomTestQuestion[]> => {
    const { data } = await supabase
      .from("custom_test_questions")
      .select("*")
      .eq("test_id", testId)
      .order("display_order");
    return (data || []).map((q: any) => ({ ...q, options: Array.isArray(q.options) ? q.options : [] }));
  };

  const saveQuestion = async (question: Omit<CustomTestQuestion, "id"> & { id?: string }) => {
    if (question.id) {
      const { error } = await supabase.from("custom_test_questions").update({
        question_text: question.question_text,
        options: question.options as any,
        correct_answer: question.correct_answer,
        image_url: question.image_url,
        display_order: question.display_order,
      }).eq("id", question.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("custom_test_questions").insert({
        test_id: question.test_id,
        question_text: question.question_text,
        options: question.options as any,
        correct_answer: question.correct_answer,
        image_url: question.image_url,
        display_order: question.display_order,
      });
      if (error) throw error;
    }
  };

  const deleteQuestion = async (questionId: string) => {
    const { error } = await supabase.from("custom_test_questions").delete().eq("id", questionId);
    if (error) throw error;
  };

  const assignTest = async (testId: string, studentIds: string[], dueDate?: string) => {
    const rows = studentIds.map((sid) => ({
      test_id: testId,
      student_id: sid,
      due_date: dueDate || null,
    }));
    const { error } = await supabase.from("test_assignments").insert(rows);
    if (error) throw error;
    // Mark test as published
    await supabase.from("custom_tests").update({ status: "published" }).eq("id", testId);
    await fetchTests();
  };

  const getSubmissions = async (testId: string) => {
    const { data } = await supabase
      .from("test_submissions")
      .select("*")
      .eq("test_id", testId)
      .order("submitted_at", { ascending: false });
    return (data || []) as TestSubmission[];
  };

  const getSubmissionAnswers = async (submissionId: string) => {
    const { data } = await supabase
      .from("test_submission_answers")
      .select("*")
      .eq("submission_id", submissionId);
    return (data || []) as TestSubmissionAnswer[];
  };

  const reopenAssignment = async (assignmentId: string, submissionId: string) => {
    // Delete the submission and its answers, then reset assignment status
    await supabase.from("test_submission_answers").delete().eq("submission_id", submissionId);
    await supabase.from("test_submissions").delete().eq("id", submissionId);
    await supabase.from("test_assignments").update({ status: "pending" }).eq("id", assignmentId);
  };

  return {
    tests, loading, fetchTests,
    createTest, updateTest, deleteTest,
    getQuestions, saveQuestion, deleteQuestion,
    assignTest, getSubmissions, getSubmissionAnswers,
    reopenAssignment,
  };
};

// Hook for students to see their assignments
export const useStudentAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<(TestAssignment & { test: CustomTest; questions: CustomTestQuestion[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: assignData } = await supabase
      .from("test_assignments")
      .select("*")
      .eq("student_id", user.id)
      .order("assigned_at", { ascending: false });

    if (assignData && assignData.length > 0) {
      const testIds = [...new Set(assignData.map((a: any) => a.test_id))];
      const assignmentIds = assignData.map((a: any) => a.id);
      const [testsRes, submissionsRes, ...questionsResults] = await Promise.all([
        supabase.from("custom_tests").select("*").in("id", testIds),
        supabase.from("test_submissions").select("assignment_id").eq("student_id", user.id).in("assignment_id", assignmentIds),
        ...testIds.map((tid) => supabase.rpc("get_assigned_test_questions", { _test_id: tid as string })),
      ]);

      const submittedAssignmentIds = new Set((submissionsRes.data || []).map((submission: any) => submission.assignment_id));
      const testsMap = new Map((testsRes.data || []).map((t: any) => [t.id, t]));
      const questionsMap = new Map<string, CustomTestQuestion[]>();
      questionsResults.forEach((res: any, idx: number) => {
        const tid = testIds[idx] as string;
        const list: CustomTestQuestion[] = (res.data || []).map((q: any) => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : [],
        }));
        questionsMap.set(tid, list);
      });

      setAssignments(
        assignData.map((a: any) => ({
          ...a,
          status: submittedAssignmentIds.has(a.id) ? "completed" : a.status,
          test: testsMap.get(a.test_id) || { id: a.test_id, title: "Unknown Test", status: "published", created_at: "", updated_at: "" },
          questions: questionsMap.get(a.test_id) || [],
        }))
      );
    } else {
      setAssignments([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const submitTest = async (assignmentId: string, _testId: string, answers: { questionId: string; selectedAnswer: number; isCorrect?: boolean }[]) => {
    if (!user) return;
    const payload = answers.map((a) => ({ questionId: a.questionId, selectedAnswer: a.selectedAnswer }));
    const { data, error } = await supabase.rpc("submit_custom_test", {
      _assignment_id: assignmentId,
      _answers: payload as any,
    });
    if (error) throw error;
    await fetchAssignments();
    const row: any = Array.isArray(data) ? data[0] : data;
    return { score: row?.score ?? 0, total: row?.total ?? 0, percentage: row?.percentage ?? 0 };
  };

  return { assignments, loading, fetchAssignments, submitTest };
};
