import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomTests, CustomTestQuestion, TestSubmission, TestSubmissionAnswer } from "@/hooks/useCustomTests";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, CheckCircle, XCircle, Eye, RotateCcw, Download } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface StudentProfile {
  full_name: string | null;
  grade: string | null;
}

const TeacherTestResults = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { getQuestions, getSubmissions, getSubmissionAnswers, reopenAssignment } = useCustomTests();

  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState<CustomTestQuestion[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [profiles, setProfiles] = useState<Map<string, StudentProfile>>(new Map());
  const [loading, setLoading] = useState(true);

  const [selectedSubmission, setSelectedSubmission] = useState<TestSubmission | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<TestSubmissionAnswer[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (testId) loadData();
  }, [testId]);

  const loadData = async () => {
    if (!testId) return;
    setLoading(true);

    const [testRes, qs, subs] = await Promise.all([
      supabase.from("custom_tests").select("title").eq("id", testId).single(),
      getQuestions(testId),
      getSubmissions(testId),
    ]);

    setTestTitle(testRes.data?.title || "Test");
    setQuestions(qs);
    setSubmissions(subs);

    const studentIds = [...new Set(subs.map((s) => s.student_id))];
    if (studentIds.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name, grade").in("user_id", studentIds);
      const map = new Map<string, StudentProfile>();
      (profs || []).forEach((p: any) => map.set(p.user_id, { full_name: p.full_name, grade: p.grade }));
      setProfiles(map);
    }
    setLoading(false);
  };

  const viewDetail = async (sub: TestSubmission) => {
    setSelectedSubmission(sub);
    const answers = await getSubmissionAnswers(sub.id);
    setSelectedAnswers(answers);
    setDetailOpen(true);
  };

  const handleReopen = async (sub: TestSubmission) => {
    try {
      await reopenAssignment(sub.assignment_id, sub.id);
      toast.success("Assignment reopened — student can retake the test");
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to reopen");
    }
  };

  const handleDownloadExcel = async () => {
    if (submissions.length === 0) return;

    // Build summary sheet
    const summaryRows = submissions.map((sub) => {
      const profile = profiles.get(sub.student_id);
      return {
        "Student Name": profile?.full_name || "Unknown",
        Grade: profile?.grade || "",
        Score: sub.score,
        "Total Questions": sub.total_questions,
        "Percentage (%)": sub.percentage,
        "Submitted At": new Date(sub.submitted_at).toLocaleString(),
      };
    });

    // Build detailed answers sheet
    const detailRows: Record<string, any>[] = [];
    for (const sub of submissions) {
      const profile = profiles.get(sub.student_id);
      const answers = await getSubmissionAnswers(sub.id);
      for (const q of questions) {
        const ans = answers.find((a) => a.question_id === q.id);
        detailRows.push({
          "Student Name": profile?.full_name || "Unknown",
          Grade: profile?.grade || "",
          Question: q.question_text,
          "Correct Answer": q.options[q.correct_answer] || "",
          "Student Answer": ans ? (q.options[ans.selected_answer] || "No answer") : "No answer",
          "Is Correct": ans?.is_correct ? "Yes" : "No",
        });
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryRows), "Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(detailRows), "Detailed Answers");
    XLSX.writeFile(wb, `${testTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Results.xlsx`);
    toast.success("Results downloaded!");
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 60) return "text-green-600";
    if (pct >= 40) return "text-primary";
    return "text-destructive";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/teacher/tests")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold font-display text-foreground">Results: {testTitle}</h1>
              <p className="text-xs text-muted-foreground">{submissions.length} submission(s) · {questions.length} questions</p>
            </div>
          </div>
          {submissions.length > 0 && (
            <Button onClick={handleDownloadExcel} variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download Excel
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No submissions yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => {
              const profile = profiles.get(sub.student_id);
              return (
                <Card key={sub.id} className="p-4 flex items-center justify-between hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {profile?.full_name?.[0]?.toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{profile?.full_name || "Student"}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.grade ? `Grade ${profile.grade}` : ""}
                        {" · "}
                        {new Date(sub.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`text-xl font-bold font-display ${getScoreColor(sub.percentage)}`}>{sub.percentage}%</p>
                      <p className="text-xs text-muted-foreground">{sub.score}/{sub.total_questions}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => viewDetail(sub)} className="gap-1">
                      <Eye className="w-3 h-3" /> Details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleReopen(sub)} className="gap-1 text-muted-foreground hover:text-foreground">
                      <RotateCcw className="w-3 h-3" /> Reopen
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {profiles.get(selectedSubmission?.student_id || "")?.full_name || "Student"}'s Answers
              <span className="ml-2">
                <Badge variant={selectedSubmission && selectedSubmission.percentage >= 60 ? "default" : "destructive"}>
                  {selectedSubmission?.percentage}% ({selectedSubmission?.score}/{selectedSubmission?.total_questions})
                </Badge>
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {questions.map((q, idx) => {
              const answer = selectedAnswers.find((a) => a.question_id === q.id);
              return (
                <div key={q.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {answer?.is_correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    )}
                    <p className="font-medium text-foreground text-sm">
                      <span className="text-muted-foreground mr-1">Q{idx + 1}.</span>
                      {q.question_text}
                    </p>
                  </div>

                  {q.image_url && (
                    <img src={q.image_url} alt="" className="w-40 h-auto rounded border ml-7" />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 ml-7">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correct_answer;
                      const isSelected = answer?.selected_answer === oIdx;
                      let bg = "";
                      if (isCorrect) bg = "bg-green-500/10 border-green-500/50";
                      else if (isSelected && !isCorrect) bg = "bg-destructive/10 border-destructive/50";

                      return (
                        <div key={oIdx} className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm ${bg}`}>
                          <span className="font-mono text-xs text-muted-foreground">{String.fromCharCode(65 + oIdx)}.</span>
                          <span className={isCorrect ? "font-semibold text-green-700" : isSelected ? "text-destructive" : ""}>{opt}</span>
                          {isCorrect && <CheckCircle className="w-3 h-3 text-green-600 ml-auto" />}
                          {isSelected && !isCorrect && <XCircle className="w-3 h-3 text-destructive ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherTestResults;
