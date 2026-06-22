import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentAssignments, CustomTestQuestion } from "@/hooks/useCustomTests";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ClipboardList, CheckCircle, Clock, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const StudentAssignments = () => {
  const navigate = useNavigate();
  const { assignments, loading, submitTest } = useStudentAssignments();

  // Quiz state
  const [activeAssignment, setActiveAssignment] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);

  const active = assignments.find((a) => a.id === activeAssignment);
  const currentQ = active?.questions?.[currentIdx];

  const startTest = (assignment: typeof assignments[0]) => {
    if (assignment.status === "completed") {
      toast.error("You have already completed this test.");
      return;
    }
    setActiveAssignment(assignment.id);
    setCurrentIdx(0);
    setAnswers({});
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!active) return;
    setSubmitting(true);
    try {
      const answerData = active.questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: answers[q.id] ?? -1,
      }));
      const res = await submitTest(active.id, active.test_id, answerData);
      setResult(res || null);
      toast.success("Test submitted!");
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    }
    setSubmitting(false);
  };

  // Show quiz
  if (active && !result) {
    const totalQs = active.questions.length;
    const answered = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setActiveAssignment(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-bold font-display text-foreground">{active.test.title}</h1>
                <p className="text-xs text-muted-foreground">Question {currentIdx + 1} of {totalQs}</p>
              </div>
            </div>
            <Badge variant="outline">{answered}/{totalQs} answered</Badge>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${((currentIdx + 1) / totalQs) * 100}%` }} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          {currentQ && (
            <Card className="p-6 space-y-4">
              <p className="font-semibold text-foreground text-lg">{currentQ.question_text}</p>
              {currentQ.image_url && (
                <img src={currentQ.image_url} alt="" className="max-w-sm h-auto rounded border" />
              )}
              <RadioGroup
                value={answers[currentQ.id] !== undefined ? String(answers[currentQ.id]) : ""}
                onValueChange={(val) => setAnswers((prev) => ({ ...prev, [currentQ.id]: parseInt(val) }))}
              >
                {currentQ.options.map((opt, oIdx) => (
                  <label
                    key={oIdx}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      answers[currentQ.id] === oIdx ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={String(oIdx)} />
                    <span className="font-mono text-sm text-muted-foreground mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                    <span>{opt}</span>
                  </label>
                ))}
              </RadioGroup>
            </Card>
          )}

          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={() => setCurrentIdx((p) => p - 1)} disabled={currentIdx === 0}>
              Previous
            </Button>
            {currentIdx < totalQs - 1 ? (
              <Button onClick={() => setCurrentIdx((p) => p + 1)} className="gap-1">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting || answered < totalQs} className="gap-1">
                <Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Test"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show result
  if (active && result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm w-full">
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${result.percentage >= 60 ? "text-green-600" : "text-primary"}`} />
          <h2 className="text-2xl font-bold font-display text-foreground mb-1">{result.percentage}%</h2>
          <p className="text-muted-foreground mb-4">{result.score} out of {result.total} correct</p>
          <Button onClick={() => { setActiveAssignment(null); setResult(null); }} className="w-full">
            Back to Assignments
          </Button>
        </Card>
      </div>
    );
  }

  // Assignments list
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold font-display text-foreground">My Assignments</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : assignments.length === 0 ? (
          <Card className="p-8 text-center">
            <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No assignments yet.</p>
          </Card>
        ) : (
          assignments.map((a) => (
            <Card key={a.id} className="p-5 flex items-center justify-between hover:border-primary/50 transition-colors">
              <div>
                <h3 className="font-bold text-foreground">{a.test.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {a.test.subject && <Badge variant="outline" className="text-xs">{a.test.subject}</Badge>}
                  <span className="text-xs text-muted-foreground">{a.questions.length} questions</span>
                  {a.due_date && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {new Date(a.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {a.status === "completed" ? (
                  <Badge className="bg-green-500/10 text-green-700 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" /> Submitted
                  </Badge>
                ) : (
                  <Button onClick={() => startTest(a)} size="sm" className="gap-1">
                    Start Test
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
