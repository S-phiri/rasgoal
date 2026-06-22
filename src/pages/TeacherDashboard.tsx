import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeacherStudents } from "@/hooks/useTeacherStudents";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import TeacherRequestsList from "@/components/TeacherRequestsList";
import SubjectTestAnalytics from "@/components/teacher/SubjectTestAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Search, Users, TrendingUp, BookOpen, BarChart3, Trash2, FileText, Video } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import UpcomingClassesCard from "@/components/UpcomingClassesCard";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { roles, switchRole } = useUserRole();
  const { students, pendingRequests, loading, acceptRequest, declineRequest, removeStudent } = useTeacherStudents();
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");

  const acceptedStudentIds = useMemo(() => {
    const gradeFiltered = gradeFilter === "all"
      ? students
      : students.filter((s) => s.profile?.grade === gradeFilter);
    return gradeFiltered.map((s) => s.studentId);
  }, [students, gradeFilter]);

  const filtered = students.filter((s) => {
    const matchesSearch = (s.profile?.full_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === "all" || s.profile?.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const classAvg = filtered.length > 0
    ? Math.round(filtered.reduce((a, s) => a + s.quizStats.avgScore, 0) / filtered.length)
    : 0;
  const totalQuizzes = filtered.reduce((a, s) => a + s.quizStats.totalQuizzes, 0);

  const handleAccept = async (id: string) => {
    await acceptRequest(id);
    toast.success("Student accepted!");
  };
  const handleDecline = async (id: string) => {
    await declineRequest(id);
    toast("Request declined");
  };

  const handleRemoveStudent = async (linkId: string) => {
    try {
      await removeStudent(linkId);
      toast.success("Student removed");
    } catch {
      toast.error("Failed to remove student");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSwitchToStudent = () => {
    switchRole("student");
    toast.success("Switched to student view");
    navigate("/", { replace: true });
  };

  const formatDate = (d: string | null) => {
    if (!d) return "No activity";
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(d).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-foreground">Teacher Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                {profile?.full_name || user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {roles.includes("student") && (
              <Button variant="outline" size="sm" onClick={handleSwitchToStudent} className="gap-1">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Student View</span>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/teacher/classes")} className="gap-1">
              <Video className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Classes</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/teacher/tests")} className="gap-1">
              <FileText className="w-4 h-4 text-accent" />
              <span className="hidden sm:inline">My Tests</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Grade Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Filter by Grade:</span>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <SelectItem key={g} value={String(g)}>
                  Grade {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: "Students", value: filtered.length, color: "text-primary" },
            { icon: TrendingUp, label: "Class Avg", value: `${classAvg}%`, color: "text-success" },
            { icon: BookOpen, label: "Total Quizzes", value: totalQuizzes, color: "text-accent" },
            { icon: Search, label: "Pending", value: pendingRequests.length, color: "text-secondary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming live classes */}
        <UpcomingClassesCard variant="teacher" />

        {/* Pending requests */}
        <TeacherRequestsList requests={pendingRequests} onAccept={handleAccept} onDecline={handleDecline} />

        {/* Subject Analytics */}
        {students.length > 0 && <SubjectTestAnalytics studentIds={acceptedStudentIds} />}

        {/* Student list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground">My Students</h2>
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                {students.length === 0
                  ? "No students linked yet. Students can add you using your email address."
                  : "No students match your search."}
              </p>
              {students.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Your email: <span className="font-mono text-foreground">{user?.email}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((student) => (
                <div
                  key={student.linkId}
                  className="bg-card rounded-xl border border-border p-4 text-left hover:border-primary/50 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate(`/teacher/student/${student.studentId}`)}>
                      {student.profile?.avatar_url && <AvatarImage src={student.profile.avatar_url} />}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {student.profile?.full_name?.[0]?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/teacher/student/${student.studentId}`)}>
                      <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {student.profile?.full_name || "Student"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.profile?.grade ? `Grade ${student.profile.grade}` : ""}
                        {student.profile?.school ? ` · ${student.profile.school}` : ""}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Student</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {student.profile?.full_name || "this student"}? You will no longer be able to view their progress.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveStudent(student.linkId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center cursor-pointer" onClick={() => navigate(`/teacher/student/${student.studentId}`)}>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-lg font-bold font-display text-foreground">{student.quizStats.avgScore}%</p>
                      <p className="text-[10px] text-muted-foreground">Avg Score</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-lg font-bold font-display text-foreground">{student.quizStats.totalQuizzes}</p>
                      <p className="text-[10px] text-muted-foreground">Quizzes</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-lg font-bold font-display text-foreground">{student.quizStats.totalCorrect}</p>
                      <p className="text-[10px] text-muted-foreground">Correct</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-2">
                    Last active: {formatDate(student.quizStats.lastActivity)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
