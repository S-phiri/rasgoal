import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherStudents } from "@/hooks/useTeacherStudents";
import { useProfile } from "@/hooks/useProfile";
import { sendClassInvitationEmails } from "@/lib/sendClassInvites";

const todayISO = () => new Date().toISOString().slice(0, 10);

const TeacherClassForm = () => {
  const { id } = useParams<{ id: string }>();
  const editing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students } = useTeacherStudents();
  const { profile } = useProfile();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState("15:00");
  const [duration, setDuration] = useState(60);
  const [classType, setClassType] = useState<"one_to_one" | "group">("group");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [originalStudentIds, setOriginalStudentIds] = useState<string[]>([]);

  useEffect(() => {
    if (!editing) return;
    (async () => {
      setLoading(true);
      const [{ data: c }, { data: a }] = await Promise.all([
        supabase.from("live_classes").select("*").eq("id", id!).maybeSingle(),
        supabase.from("live_class_assignments").select("student_id").eq("class_id", id!),
      ]);
      if (c) {
        setTitle(c.title);
        setSubject(c.subject || "");
        setGrade(c.grade || "");
        setTopic(c.topic || "");
        setDescription(c.description || "");
        setDate(c.scheduled_date);
        const s = new Date(c.start_time);
        setStartTime(s.toTimeString().slice(0, 5));
        setDuration(c.duration_minutes);
        setClassType(c.class_type);
      }
      const existing = (a || []).map((x: any) => x.student_id);
      setSelectedStudentIds(existing);
      setOriginalStudentIds(existing);
      setLoading(false);
    })();
  }, [editing, id]);

  const toggleStudent = (sid: string) => {
    setSelectedStudentIds((prev) => {
      if (prev.includes(sid)) return prev.filter((x) => x !== sid);
      if (classType === "one_to_one") return [sid];
      return [...prev, sid];
    });
  };

  const computedEnd = useMemo(() => {
    if (!date || !startTime) return null;
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    return { start, end };
  }, [date, startTime, duration]);

  const handleSave = async () => {
    if (!user || !title.trim() || !computedEnd) {
      toast.error("Please fill title, date and time");
      return;
    }
    if (classType === "one_to_one" && selectedStudentIds.length !== 1) {
      toast.error("One-to-one needs exactly 1 student");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Assign at least one student");
      return;
    }

    setSaving(true);
    const payload = {
      teacher_id: user.id,
      title: title.trim(),
      subject: subject || null,
      grade: grade || null,
      topic: topic || null,
      description: description || null,
      scheduled_date: date,
      start_time: computedEnd.start.toISOString(),
      end_time: computedEnd.end.toISOString(),
      duration_minutes: duration,
      class_type: classType,
    };

    let classId = id;
    if (editing) {
      const { error } = await supabase.from("live_classes").update(payload).eq("id", id!);
      if (error) { toast.error(error.message); setSaving(false); return; }
      // wipe & re-insert assignments for simplicity
      await supabase.from("live_class_assignments").delete().eq("class_id", id!);
    } else {
      const { data, error } = await supabase
        .from("live_classes")
        .insert(payload)
        .select("id")
        .single();
      if (error || !data) { toast.error(error?.message || "Failed"); setSaving(false); return; }
      classId = data.id;
    }

    const rows = selectedStudentIds.map((sid) => ({ class_id: classId!, student_id: sid }));
    const { error: aErr } = await supabase.from("live_class_assignments").insert(rows);
    if (aErr) {
      toast.error("Class saved but some students couldn't be assigned: " + aErr.message);
    } else {
      toast.success(editing ? "Class updated" : "Class created");

      // Email newly added students
      const newIds = selectedStudentIds.filter((sid) => !originalStudentIds.includes(sid));
      if (newIds.length > 0) {
        const recipients = newIds
          .map((sid) => {
            const s = students.find((x) => x.studentId === sid);
            return s?.studentEmail
              ? { studentId: sid, email: s.studentEmail, name: s.profile?.full_name || null }
              : null;
          })
          .filter(Boolean) as { studentId: string; email: string; name: string | null }[];

        if (recipients.length > 0) {
          sendClassInvitationEmails({
            classId: classId!,
            classTitle: title.trim(),
            subject: subject || null,
            topic: topic || null,
            description: description || null,
            classType,
            startTimeISO: computedEnd.start.toISOString(),
            durationMinutes: duration,
            teacherName: profile?.full_name || "Your teacher",
            recipients,
          });
        }
      }
    }
    setSaving(false);
    navigate(`/teacher/classes/${classId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-display font-bold text-foreground">
            {editing ? "Edit Class" : "Schedule Live Class"}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="space-y-2">
          <Label>Class title *</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Algebra revision" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
          </div>
          <div className="space-y-2">
            <Label>Grade</Label>
            <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. 12" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Topic</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Quadratic equations" />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label>Date *</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Start *</Label>
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Duration (min) *</Label>
            <Input
              type="number"
              min={15}
              max={240}
              step={15}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value) || 60)}
            />
          </div>
        </div>

        {computedEnd && (
          <p className="text-xs text-muted-foreground">
            Ends at {computedEnd.end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </p>
        )}

        <div className="space-y-2">
          <Label>Class type</Label>
          <Select value={classType} onValueChange={(v) => setClassType(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="group">Group class</SelectItem>
              <SelectItem value="one_to_one">One-to-one</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Assign students *</Label>
          {students.length === 0 ? (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              You have no linked students yet. Students must add you using your email before you can assign them to a class.
            </p>
          ) : (
            <div className="border border-border rounded-lg divide-y divide-border max-h-64 overflow-y-auto">
              {students.map((s) => {
                const checked = selectedStudentIds.includes(s.studentId);
                return (
                  <label
                    key={s.studentId}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/40"
                  >
                    <Checkbox checked={checked} onCheckedChange={() => toggleStudent(s.studentId)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {s.profile?.full_name || s.studentEmail || "Student"}
                      </p>
                      {s.profile?.grade && (
                        <p className="text-[11px] text-muted-foreground">Grade {s.profile.grade}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            {selectedStudentIds.length} selected
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 gap-1">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editing ? "Save changes" : "Create class"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassForm;
