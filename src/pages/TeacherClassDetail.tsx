import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, Pencil, Video, Trash2, Plus, ExternalLink, FileText, Link as LinkIcon, Upload, Loader2,
  Users, Clock, Save, X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLiveClass, LiveResourceType } from "@/hooks/useLiveClasses";
import { useTeacherStudents } from "@/hooks/useTeacherStudents";
import { useProfile } from "@/hooks/useProfile";
import { sendClassInvitationEmails } from "@/lib/sendClassInvites";
import { useNow } from "@/hooks/useNow";
import { canJoinClass, formatClassTime } from "@/lib/classTime";

const TeacherClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { liveClass, assignments, resources, loading, refetch } = useLiveClass(id);
  const { students } = useTeacherStudents();
  const { profile } = useProfile();
  const now = useNow();

  const [recordingUrl, setRecordingUrl] = useState("");
  const [resType, setResType] = useState<LiveResourceType>("link");
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resContent, setResContent] = useState("");
  const [uploading, setUploading] = useState(false);

  // Inline editing states
  const [editingParticipants, setEditingParticipants] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [savingParticipants, setSavingParticipants] = useState(false);

  const [editingTime, setEditingTime] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editDuration, setEditDuration] = useState(60);
  const [savingTime, setSavingTime] = useState(false);

  useEffect(() => {
    if (liveClass) {
      setEditDate(liveClass.scheduled_date);
      setEditStartTime(new Date(liveClass.start_time).toTimeString().slice(0, 5));
      setEditDuration(liveClass.duration_minutes);
    }
  }, [liveClass]);

  useEffect(() => {
    setSelectedStudentIds(assignments.map((a) => a.student_id));
  }, [assignments]);

  const toggleStudent = (sid: string) => {
    setSelectedStudentIds((prev) => {
      if (prev.includes(sid)) return prev.filter((x) => x !== sid);
      if (liveClass?.class_type === "one_to_one") return [sid];
      return [...prev, sid];
    });
  };

  const handleSaveParticipants = async () => {
    if (!liveClass) return;
    if (liveClass.class_type === "one_to_one" && selectedStudentIds.length !== 1) {
      toast.error("One-to-one needs exactly 1 student");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Assign at least one student");
      return;
    }
    setSavingParticipants(true);
    const originalIds = assignments.map((a) => a.student_id);
    const newIds = selectedStudentIds.filter((sid) => !originalIds.includes(sid));

    await supabase.from("live_class_assignments").delete().eq("class_id", liveClass.id);
    const rows = selectedStudentIds.map((sid) => ({ class_id: liveClass.id, student_id: sid }));
    const { error } = await supabase.from("live_class_assignments").insert(rows);
    if (error) toast.error(error.message);
    else {
      toast.success("Participants updated");
      setEditingParticipants(false);

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
            classId: liveClass.id,
            classTitle: liveClass.title,
            subject: liveClass.subject,
            topic: liveClass.topic,
            description: liveClass.description,
            classType: liveClass.class_type,
            startTimeISO: liveClass.start_time,
            durationMinutes: liveClass.duration_minutes,
            teacherName: profile?.full_name || "Your teacher",
            recipients,
          });
        }
      }

      refetch();
    }
    setSavingParticipants(false);
  };

  const handleSaveTime = async () => {
    if (!liveClass || !editDate || !editStartTime) return;
    const start = new Date(`${editDate}T${editStartTime}`);
    const end = new Date(start.getTime() + editDuration * 60 * 1000);
    setSavingTime(true);
    const { error } = await supabase
      .from("live_classes")
      .update({
        scheduled_date: editDate,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        duration_minutes: editDuration,
      })
      .eq("id", liveClass.id);
    if (error) toast.error(error.message);
    else { toast.success("Start time updated"); setEditingTime(false); refetch(); }
    setSavingTime(false);
  };

  const studentMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of students) m.set(s.studentId, s.profile?.full_name || s.studentEmail || "Student");
    return m;
  }, [students]);

  if (loading || !liveClass) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const joinable = canJoinClass(liveClass, now);

  const handleCancel = async () => {
    const { error } = await supabase.from("live_classes").update({ status: "cancelled" }).eq("id", liveClass.id);
    if (error) toast.error(error.message); else { toast.success("Class cancelled"); refetch(); }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("live_classes").delete().eq("id", liveClass.id);
    if (error) toast.error(error.message); else { toast.success("Class deleted"); navigate("/teacher/classes"); }
  };

  const handleAttendance = async (assignmentId: string, attended: boolean) => {
    const { error } = await supabase.from("live_class_assignments").update({ attended }).eq("id", assignmentId);
    if (error) toast.error(error.message); else refetch();
  };

  const handleSaveRecording = async () => {
    const { error } = await supabase
      .from("live_classes")
      .update({ recording_url: recordingUrl.trim() || null, status: "completed" })
      .eq("id", liveClass.id);
    if (error) toast.error(error.message); else { toast.success("Recording link saved"); setRecordingUrl(""); refetch(); }
  };

  const handleAddResource = async () => {
    if (!resTitle.trim()) { toast.error("Title required"); return; }
    if ((resType === "link" || resType === "file") && !resUrl.trim()) { toast.error("URL required"); return; }
    const { error } = await supabase.from("live_class_resources").insert({
      class_id: liveClass.id,
      title: resTitle.trim(),
      type: resType,
      url: resUrl.trim() || null,
      content: resContent.trim() || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Resource added");
      setResTitle(""); setResUrl(""); setResContent("");
      refetch();
    }
  };

  const handleDeleteResource = async (rid: string) => {
    const { error } = await supabase.from("live_class_resources").delete().eq("id", rid);
    if (error) toast.error(error.message); else refetch();
  };

  const handleFileUpload = async (file: File) => {
    if (!liveClass) return;
    setUploading(true);
    const path = `${liveClass.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("class-resources").upload(path, file);
    if (upErr) { toast.error(upErr.message); setUploading(false); return; }
    const { data: signed } = await supabase.storage.from("class-resources").createSignedUrl(path, 60 * 60 * 24 * 365);
    const { error } = await supabase.from("live_class_resources").insert({
      class_id: liveClass.id,
      title: file.name,
      type: "file",
      url: signed?.signedUrl || null,
    });
    if (error) toast.error(error.message); else { toast.success("File uploaded"); refetch(); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/classes")} className="gap-1">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Back</span>
          </Button>
          <h1 className="font-display font-bold text-foreground truncate flex-1 text-center">{liveClass.title}</h1>
          <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/classes/${liveClass.id}/edit`)} className="gap-1">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Overview */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px]">{liveClass.class_type === "one_to_one" ? "1-on-1" : "Group"}</Badge>
            <Badge
              className={`text-[10px] ${
                liveClass.status === "cancelled" ? "bg-destructive text-destructive-foreground" :
                liveClass.status === "completed" ? "bg-muted text-muted-foreground" :
                joinable ? "bg-success text-success-foreground" : "bg-primary/15 text-primary"
              }`}
            >
              {liveClass.status === "cancelled" ? "Cancelled" : liveClass.status === "completed" ? "Completed" : joinable ? "Live window" : "Scheduled"}
            </Badge>
          </div>

          {/* Inline time editing */}
          {editingTime ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px]">Date</Label>
                  <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Start</Label>
                  <Input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Duration (min)</Label>
                  <Input type="number" min={15} max={240} step={15} value={editDuration} onChange={(e) => setEditDuration(Number(e.target.value) || 60)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingTime(false)} className="gap-1"><X className="w-3 h-3" />Cancel</Button>
                <Button size="sm" onClick={handleSaveTime} disabled={savingTime} className="gap-1">{savingTime && <Loader2 className="w-3 h-3 animate-spin" />}<Save className="w-3 h-3" />Save time</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{formatClassTime(liveClass)}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingTime(true)}><Pencil className="w-3 h-3 text-muted-foreground" /></Button>
            </div>
          )}

          {(liveClass.subject || liveClass.grade || liveClass.topic) && (
            <p className="text-sm text-muted-foreground">
              {[liveClass.subject, liveClass.grade && `Grade ${liveClass.grade}`, liveClass.topic].filter(Boolean).join(" · ")}
            </p>
          )}
          {liveClass.description && <p className="text-sm text-foreground mt-2">{liveClass.description}</p>}

          <div className="flex flex-wrap gap-2 pt-3">
            <Button
              onClick={() => window.open(`/classes/${liveClass.id}/room`, "_blank", "noopener,noreferrer")}
              disabled={liveClass.status === "cancelled"}
              className="gap-2"
            >
              <Video className="w-4 h-4" />
              Start live class
            </Button>
            {liveClass.status !== "cancelled" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">Cancel class</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this class?</AlertDialogTitle>
                    <AlertDialogDescription>Students will see it as cancelled and won't be able to join.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>Cancel class</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-destructive gap-1">
                  <Trash2 className="w-4 h-4" />Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this class?</AlertDialogTitle>
                  <AlertDialogDescription>This will remove the class, all assignments, and resources.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Attendance / Participants */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold">Assigned students & attendance</h2>
            {!editingParticipants && (
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setEditingParticipants(true)}>
                <Users className="w-3 h-3" />Edit list
              </Button>
            )}
          </div>

          {editingParticipants ? (
            <div className="space-y-3">
              {students.length === 0 ? (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  You have no linked students yet.
                </p>
              ) : (
                <div className="border border-border rounded-lg divide-y divide-border max-h-64 overflow-y-auto">
                  {students.map((s) => {
                    const checked = selectedStudentIds.includes(s.studentId);
                    return (
                      <label key={s.studentId} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/40">
                        <Checkbox checked={checked} onCheckedChange={() => toggleStudent(s.studentId)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{s.profile?.full_name || s.studentEmail || "Student"}</p>
                          {s.profile?.grade && <p className="text-[11px] text-muted-foreground">Grade {s.profile.grade}</p>}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">{selectedStudentIds.length} selected</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingParticipants(false); setSelectedStudentIds(assignments.map((a) => a.student_id)); }} className="gap-1"><X className="w-3 h-3" />Cancel</Button>
                  <Button size="sm" onClick={handleSaveParticipants} disabled={savingParticipants} className="gap-1">{savingParticipants && <Loader2 className="w-3 h-3 animate-spin" />}<Save className="w-3 h-3" />Save</Button>
                </div>
              </div>
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students assigned.</p>
          ) : (
            <div className="divide-y divide-border">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{studentMap.get(a.student_id) || "Student"}</p>
                    {a.joined_at && (
                      <p className="text-[11px] text-muted-foreground">
                        Joined {new Date(a.joined_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <Checkbox checked={a.attended} onCheckedChange={(v) => handleAttendance(a.id, !!v)} />
                    Attended
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="font-display font-bold">Resources</h2>

          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources yet.</p>
          ) : (
            <div className="space-y-2">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {r.type === "link" && <LinkIcon className="w-4 h-4 text-primary shrink-0" />}
                    {r.type === "file" && <FileText className="w-4 h-4 text-primary shrink-0" />}
                    {(r.type === "note" || r.type === "homework") && <FileText className="w-4 h-4 text-accent shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{r.type}</p>
                      {r.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.content}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="w-4 h-4" /></Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteResource(r.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-sm font-semibold">Add resource</p>
            <div className="grid grid-cols-3 gap-2">
              <Select value={resType} onValueChange={(v) => setResType(v as LiveResourceType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="homework">Homework</SelectItem>
                </SelectContent>
              </Select>
              <Input className="col-span-2" placeholder="Title" value={resTitle} onChange={(e) => setResTitle(e.target.value)} />
            </div>
            {(resType === "link") && (
              <Input placeholder="https://…" value={resUrl} onChange={(e) => setResUrl(e.target.value)} />
            )}
            {(resType === "note" || resType === "homework") && (
              <Input placeholder="Details" value={resContent} onChange={(e) => setResContent(e.target.value)} />
            )}
            <Button size="sm" onClick={handleAddResource} className="gap-1"><Plus className="w-4 h-4" />Add</Button>

            <div className="pt-2">
              <Label className="text-sm">Or upload a file (PDF, worksheet…)</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="file"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                    e.target.value = "";
                  }}
                />
                {uploading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              </div>
            </div>
          </div>
        </div>

        {/* Recording */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <h2 className="font-display font-bold">Recording</h2>
          {liveClass.recording_url ? (
            <a href={liveClass.recording_url} target="_blank" rel="noopener noreferrer"
              className="text-sm text-primary underline break-all flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />{liveClass.recording_url}
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">No recording link yet.</p>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Paste recording URL after class"
              value={recordingUrl}
              onChange={(e) => setRecordingUrl(e.target.value)}
            />
            <Button onClick={handleSaveRecording} size="sm" className="gap-1"><Upload className="w-4 h-4" />Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassDetail;
