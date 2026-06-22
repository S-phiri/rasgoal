import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface LinkedStudent {
  linkId: string;
  studentId: string;
  studentEmail: string | null;
  status: string;
  linkedAt: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    grade: string | null;
    school: string | null;
  } | null;
  quizStats: {
    totalQuizzes: number;
    avgScore: number;
    totalCorrect: number;
    lastActivity: string | null;
  };
}

export interface LinkedTeacher {
  linkId: string;
  teacherId: string;
  teacherEmail: string | null;
  status: string;
  linkedAt: string;
  profile: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export const useTeacherStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<LinkedStudent[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LinkedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: links } = await (supabase as any)
      .from("teacher_student_links")
      .select("*")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false });

    if (!links || links.length === 0) {
      setStudents([]);
      setPendingRequests([]);
      setLoading(false);
      return;
    }

    const studentIds = links.map((l: any) => l.student_id);

    // Fetch profiles for all students
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url, grade, school")
      .in("user_id", studentIds);

    // Fetch quiz stats for all students
    const { data: quizHistory } = await supabase
      .from("quiz_history")
      .select("user_id, score, total_questions, percentage, completed_at")
      .in("user_id", studentIds);

    // Fetch student emails via RPC (security definer)
    let emailMap = new Map<string, string>();
    try {
      const { data: emails } = await (supabase as any).rpc("get_student_emails_for_teacher", {
        _teacher_id: user.id,
      });
      if (emails && Array.isArray(emails)) {
        emails.forEach((e: any) => emailMap.set(e.student_id, e.email));
      }
    } catch {
      // Fallback: no emails available
    }

    const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
    const quizMap = new Map<string, any[]>();
    (quizHistory || []).forEach((q: any) => {
      if (!quizMap.has(q.user_id)) quizMap.set(q.user_id, []);
      quizMap.get(q.user_id)!.push(q);
    });

    const mapped: LinkedStudent[] = links.map((link: any) => {
      const quizzes = quizMap.get(link.student_id) || [];
      const totalQuizzes = quizzes.length;
      const avgScore = totalQuizzes > 0 ? Math.round(quizzes.reduce((a: number, q: any) => a + q.percentage, 0) / totalQuizzes) : 0;
      const totalCorrect = quizzes.reduce((a: number, q: any) => a + q.score, 0);
      const sorted = [...quizzes].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

      return {
        linkId: link.id,
        studentId: link.student_id,
        studentEmail: emailMap.get(link.student_id) || null,
        status: link.status,
        linkedAt: link.created_at,
        profile: profileMap.get(link.student_id) || null,
        quizStats: {
          totalQuizzes,
          avgScore,
          totalCorrect,
          lastActivity: sorted[0]?.completed_at || null,
        },
      };
    });

    setStudents(mapped.filter((s) => s.status === "accepted"));
    setPendingRequests(mapped.filter((s) => s.status === "pending"));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const acceptRequest = async (linkId: string) => {
    await (supabase as any)
      .from("teacher_student_links")
      .update({ status: "accepted" })
      .eq("id", linkId);
    await fetchStudents();
  };

  const declineRequest = async (linkId: string) => {
    await (supabase as any)
      .from("teacher_student_links")
      .update({ status: "declined" })
      .eq("id", linkId);
    await fetchStudents();
  };

  const removeStudent = async (linkId: string) => {
    await (supabase as any)
      .from("teacher_student_links")
      .delete()
      .eq("id", linkId);
    await fetchStudents();
  };

  return { students, pendingRequests, loading, acceptRequest, declineRequest, removeStudent, refetch: fetchStudents };
};

export const useStudentTeachers = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<LinkedTeacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: links } = await (supabase as any)
      .from("teacher_student_links")
      .select("*")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    if (!links || links.length === 0) {
      setTeachers([]);
      setLoading(false);
      return;
    }

    const teacherIds = links.map((l: any) => l.teacher_id);

    let profileMap = new Map();
    if (teacherIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", teacherIds);
      profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
    }

    // Fetch emails for pending teachers
    let emailMap = new Map<string, string>();
    try {
      const { data: emails } = await (supabase as any).rpc("get_teacher_emails_for_student", {
        _student_id: user.id,
      });
      if (emails && Array.isArray(emails)) {
        emails.forEach((e: any) => emailMap.set(e.teacher_id, e.email));
      }
    } catch {
      // Fallback: no emails available
    }

    setTeachers(links.map((l: any) => ({
      linkId: l.id,
      teacherId: l.teacher_id,
      teacherEmail: emailMap.get(l.teacher_id) || null,
      status: l.status,
      linkedAt: l.created_at,
      profile: profileMap.get(l.teacher_id) || null,
    })));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  const addTeacher = async (email: string) => {
    if (!user) throw new Error("Not logged in");
    const { data: teacherId, error } = await supabase.rpc("find_teacher_by_email", { _email: email.trim().toLowerCase() } as any);
    if (error) throw error;
    if (!teacherId) throw new Error("No teacher found with that email address. Make sure they have a teacher account.");

    const { data: existing } = await (supabase as any)
      .from("teacher_student_links")
      .select("id, status")
      .eq("teacher_id", teacherId)
      .eq("student_id", user.id)
      .maybeSingle();

    if (existing) {
      if (existing.status === "pending") throw new Error("Request already pending for this teacher.");
      if (existing.status === "accepted") throw new Error("You're already linked to this teacher.");
      if (existing.status === "declined") {
        await (supabase as any)
          .from("teacher_student_links")
          .delete()
          .eq("id", existing.id);
      }
    }

    const { error: insertError } = await (supabase as any)
      .from("teacher_student_links")
      .insert({ teacher_id: teacherId, student_id: user.id });
    if (insertError) throw insertError;
    await fetchTeachers();
  };

  const removeTeacher = async (linkId: string) => {
    await (supabase as any)
      .from("teacher_student_links")
      .delete()
      .eq("id", linkId);
    await fetchTeachers();
  };

  return { teachers, loading, addTeacher, removeTeacher, refetch: fetchTeachers };
};
