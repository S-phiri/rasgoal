import { useStudentTeachers } from "@/hooks/useTeacherStudents";
import AddTeacherDialog from "@/components/AddTeacherDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import DirectChat from "@/components/DirectChat";

const statusColors: Record<string, string> = {
  pending: "bg-secondary/20 text-secondary border-secondary/30",
  accepted: "bg-success/20 text-success border-success/30",
  declined: "bg-destructive/20 text-destructive border-destructive/30",
};

const StudentTeacherManager = () => {
  const { teachers, loading, addTeacher, removeTeacher } = useStudentTeachers();

  const handleRemove = async (linkId: string) => {
    try {
      await removeTeacher(linkId);
      toast.success("Teacher removed");
    } catch {
      toast.error("Failed to remove teacher");
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-accent" />
          <h3 className="font-display font-bold text-sm text-foreground">My Teachers</h3>
        </div>
        <AddTeacherDialog onAdd={addTeacher} />
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : teachers.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-3">
          No teachers linked yet. Add a teacher to share your progress!
        </p>
      ) : (
        <div className="space-y-2">
          {teachers.map((t) => (
            <div key={t.linkId} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  {t.profile?.avatar_url && <AvatarImage src={t.profile.avatar_url} />}
                  <AvatarFallback className="text-xs bg-accent/20 text-accent">
                    {t.profile?.full_name?.[0]?.toUpperCase() || "T"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.profile?.full_name || (t.status === "pending" && t.teacherEmail) || "Teacher"}
                  </p>
                  {t.status === "pending" && t.teacherEmail && (
                    <p className="text-[10px] text-muted-foreground">{t.teacherEmail}</p>
                  )}
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[t.status] || ""}`}>
                    {t.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {t.status === "accepted" && (
                  <DirectChat otherUserId={t.teacherId} otherUserName={t.profile?.full_name || "Teacher"} />
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemove(t.linkId)}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTeacherManager;
