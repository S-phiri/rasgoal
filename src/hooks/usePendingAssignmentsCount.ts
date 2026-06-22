import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const usePendingAssignmentsCount = () => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setPendingCount(0);
      return;
    }

    const fetchPendingCount = async () => {
      const [{ data: assignments, error: assignmentsError }, { data: submissions, error: submissionsError }] = await Promise.all([
        supabase.from("test_assignments").select("id").eq("student_id", user.id),
        supabase.from("test_submissions").select("assignment_id").eq("student_id", user.id),
      ]);

      if (assignmentsError || submissionsError) return;

      const submittedIds = new Set((submissions || []).map((submission) => submission.assignment_id));
      const count = (assignments || []).filter((assignment) => !submittedIds.has(assignment.id)).length;
      setPendingCount(count);
    };

    fetchPendingCount();

    const channel = supabase
      .channel(`student-assignment-count-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "test_assignments", filter: `student_id=eq.${user.id}` },
        fetchPendingCount,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "test_submissions", filter: `student_id=eq.${user.id}` },
        fetchPendingCount,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return pendingCount;
};
