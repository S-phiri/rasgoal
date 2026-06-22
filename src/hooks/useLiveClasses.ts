import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type LiveClassType = "one_to_one" | "group";
export type LiveClassStatus = "scheduled" | "live" | "completed" | "cancelled";
export type LiveResourceType = "link" | "file" | "note" | "homework";

export interface LiveClass {
  id: string;
  teacher_id: string;
  title: string;
  subject: string | null;
  grade: string | null;
  topic: string | null;
  description: string | null;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  class_type: LiveClassType;
  room_name: string;
  recording_url: string | null;
  status: LiveClassStatus;
  created_at: string;
  updated_at: string;
}

export interface LiveClassAssignment {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string | null;
  attended: boolean;
}

export interface LiveClassResource {
  id: string;
  class_id: string;
  title: string;
  type: LiveResourceType;
  url: string | null;
  content: string | null;
  created_at: string;
}

export const useTeacherClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .eq("teacher_id", user.id)
      .order("start_time", { ascending: false });
    setClasses((data as LiveClass[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { classes, loading, refetch: fetch };
};

export const useStudentClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: assigns } = await supabase
      .from("live_class_assignments")
      .select("class_id")
      .eq("student_id", user.id);
    const ids = (assigns || []).map((a: any) => a.class_id);
    if (ids.length === 0) {
      setClasses([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("live_classes")
      .select("*")
      .in("id", ids)
      .order("start_time", { ascending: false });
    setClasses((data as LiveClass[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { classes, loading, refetch: fetch };
};

export const useLiveClass = (classId: string | undefined) => {
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [assignments, setAssignments] = useState<LiveClassAssignment[]>([]);
  const [resources, setResources] = useState<LiveClassResource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    const [{ data: c }, { data: a }, { data: r }] = await Promise.all([
      supabase.from("live_classes").select("*").eq("id", classId).maybeSingle(),
      supabase.from("live_class_assignments").select("*").eq("class_id", classId),
      supabase.from("live_class_resources").select("*").eq("class_id", classId).order("created_at", { ascending: false }),
    ]);
    setLiveClass(c as LiveClass | null);
    setAssignments((a as LiveClassAssignment[]) || []);
    setResources((r as LiveClassResource[]) || []);
    setLoading(false);
  }, [classId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { liveClass, assignments, resources, loading, refetch: fetch };
};
