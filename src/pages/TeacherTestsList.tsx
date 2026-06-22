import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomTests } from "@/hooks/useCustomTests";
import { useTeacherStudents } from "@/hooks/useTeacherStudents";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Edit, Trash2, Send, Eye, FileText, Users } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const TeacherTestsList = () => {
  const navigate = useNavigate();
  const { tests, loading, deleteTest, assignTest } = useCustomTests();
  const { students } = useTeacherStudents();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [dueDate, setDueDate] = useState("");

  const handleDelete = async (id: string) => {
    try {
      await deleteTest(id);
      toast.success("Test deleted");
    } catch {
      toast.error("Failed to delete test");
    }
  };

  const openAssignDialog = (testId: string) => {
    setSelectedTestId(testId);
    setSelectedStudents([]);
    setGradeFilter("all");
    setDueDate("");
    setAssignDialogOpen(true);
  };

  const filteredStudents = gradeFilter === "all"
    ? students
    : students.filter((s) => s.profile?.grade === gradeFilter);

  const selectAll = () => {
    setSelectedStudents(filteredStudents.map((s) => s.studentId));
  };

  const handleAssign = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Select at least one student");
      return;
    }
    try {
      await assignTest(selectedTestId, selectedStudents, dueDate || undefined);
      toast.success(`Test assigned to ${selectedStudents.length} student(s)`);
      setAssignDialogOpen(false);
    } catch (err: any) {
      if (err.message?.includes("duplicate")) {
        toast.error("Some students already have this test assigned");
      } else {
        toast.error("Assignment failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/teacher")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold font-display text-foreground">My Tests</h1>
          </div>
          <Button onClick={() => navigate("/teacher/tests/new")} className="gap-1">
            <Plus className="w-4 h-4" /> Create Test
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : tests.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-3">No tests created yet</p>
            <Button onClick={() => navigate("/teacher/tests/new")} className="gap-1">
              <Plus className="w-4 h-4" /> Create Your First Test
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test) => (
              <Card key={test.id} className="p-5 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{test.title}</h3>
                    {test.subject && <p className="text-xs text-muted-foreground">{test.subject}</p>}
                    {test.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{test.description}</p>}
                  </div>
                  <Badge variant={test.status === "published" ? "default" : "secondary"}>
                    {test.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>{test.questionCount} questions</span>
                  <span>{test.assignmentCount} assigned</span>
                  <span>{test.submissionCount} submitted</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/tests/${test.id}`)} className="gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openAssignDialog(test.id)} className="gap-1">
                    <Send className="w-3 h-3" /> Assign
                  </Button>
                  {test.submissionCount! > 0 && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/teacher/tests/${test.id}/results`)} className="gap-1">
                      <Eye className="w-3 h-3" /> Results
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Test</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this test and all associated data.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(test.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Test</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Filter by Grade</Label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                    <SelectItem key={g} value={String(g)}>Grade {g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Due Date (optional)</Label>
              <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Select Students</Label>
              <Button variant="ghost" size="sm" onClick={selectAll}>Select All ({filteredStudents.length})</Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
              {filteredStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No students found</p>
              ) : (
                filteredStudents.map((s) => (
                  <label key={s.studentId} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer">
                    <Checkbox
                      checked={selectedStudents.includes(s.studentId)}
                      onCheckedChange={(checked) => {
                        setSelectedStudents((prev) =>
                          checked ? [...prev, s.studentId] : prev.filter((id) => id !== s.studentId)
                        );
                      }}
                    />
                    <span className="text-sm">{s.profile?.full_name || "Student"}</span>
                    {s.profile?.grade && <Badge variant="outline" className="text-[10px]">G{s.profile.grade}</Badge>}
                  </label>
                ))
              )}
            </div>

            <Button onClick={handleAssign} className="w-full gap-1" disabled={selectedStudents.length === 0}>
              <Users className="w-4 h-4" /> Assign to {selectedStudents.length} Student(s)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherTestsList;
