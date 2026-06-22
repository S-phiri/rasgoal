import { useState, useMemo } from "react";
import { subjects, getSubjectTestInfo, testsBySubject } from "@/data/questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle, ChevronRight } from "lucide-react";
import QuestionDetailDialog from "./QuestionDetailDialog";
import type { StudentAttemptRecord } from "@/hooks/useTeacherAnalytics";
import type { Question } from "@/data/questions/types";

interface RankedQuestion {
  questionId: string;
  subject: string;
  subjectName: string;
  subjectIcon: string;
  examNumber: number;
  totalAttempts: number;
  totalWrong: number;
  totalRight: number;
  failRate: number;
  questionDef: Question | null;
  answerDistribution: Record<number, number>;
}

interface Props {
  attempts: StudentAttemptRecord[];
  initialSubject?: string;
}

const FailedQuestionsRanking = ({ attempts, initialSubject }: Props) => {
  const [subjectFilter, setSubjectFilter] = useState(initialSubject || "all");
  const [testFilter, setTestFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<RankedQuestion | null>(null);

  const availableSubjects = useMemo(() => {
    const ids = [...new Set(attempts.map((a) => a.subject))];
    return subjects.filter((s) => ids.includes(s.id));
  }, [attempts]);

  const availableTests = useMemo(() => {
    if (subjectFilter === "all") return [];
    const info = getSubjectTestInfo(subjectFilter);
    return info.filter((t) => t.isAvailable);
  }, [subjectFilter]);

  const ranked = useMemo(() => {
    let filtered = [...attempts];

    if (subjectFilter !== "all") filtered = filtered.filter((a) => a.subject === subjectFilter);
    if (testFilter !== "all") filtered = filtered.filter((a) => a.exam_number === Number(testFilter));
    if (dateFrom) filtered = filtered.filter((a) => a.created_at >= dateFrom);
    if (dateTo) filtered = filtered.filter((a) => a.created_at <= dateTo + "T23:59:59");

    // Aggregate by question
    const map = new Map<string, { totalAttempts: number; totalWrong: number; totalRight: number; subject: string; examNumber: number; questionId: string; answerDistribution: Record<number, number> }>();

    filtered.forEach((a) => {
      const key = `${a.subject}-${a.exam_number}-${a.question_id}`;
      const prev = map.get(key) || { totalAttempts: 0, totalWrong: 0, totalRight: 0, subject: a.subject, examNumber: a.exam_number, questionId: a.question_id, answerDistribution: {} };
      prev.totalAttempts++;
      if (!a.final_correct) prev.totalWrong++;
      else prev.totalRight++;
      if (a.selected_answer != null) {
        prev.answerDistribution[a.selected_answer] = (prev.answerDistribution[a.selected_answer] || 0) + 1;
      }
      map.set(key, prev);
    });

    return [...map.values()]
      .filter((q) => q.totalWrong > 0)
      .sort((a, b) => b.totalWrong - a.totalWrong)
      .map((q): RankedQuestion => {
        const subj = subjects.find((s) => s.id === q.subject);
        const allQuestions = testsBySubject[q.subject]?.flat() || [];
        const qDef = allQuestions.find((qd) => String(qd.id) === q.questionId) || null;
        return {
          ...q,
          subjectName: subj?.name || q.subject,
          subjectIcon: subj?.icon || "📝",
          failRate: Math.round((q.totalWrong / q.totalAttempts) * 100),
          questionDef: qDef,
        };
      });
  }, [attempts, subjectFilter, testFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Select value={subjectFilter} onValueChange={(v) => { setSubjectFilter(v); setTestFilter("all"); }}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {availableSubjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={testFilter} onValueChange={setTestFilter} disabled={subjectFilter === "all"}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="All Tests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tests</SelectItem>
            {availableTests.map((t) => (
              <SelectItem key={t.testNumber} value={String(t.testNumber)}>Test #{t.testNumber}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 text-xs" placeholder="From" />
        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 text-xs" placeholder="To" />
      </div>

      {/* Results */}
      <p className="text-xs text-muted-foreground">{ranked.length} questions with failures</p>

      {ranked.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">No failed questions found for the selected filters.</div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {ranked.map((q, i) => (
            <button
              key={`${q.subject}-${q.examNumber}-${q.questionId}`}
              onClick={() => setSelectedQuestion(q)}
              className="w-full text-left rounded-lg border border-border p-3 bg-card hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className={`text-sm font-bold min-w-[2rem] text-center pt-0.5 ${i < 3 ? "text-destructive" : "text-muted-foreground"}`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug line-clamp-2">
                    {q.questionDef?.question || `Question #${q.questionId}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{q.subjectIcon} {q.subjectName}</Badge>
                    <Badge variant="outline" className="text-[10px]">Test #{q.examNumber}</Badge>
                    <span className="flex items-center gap-0.5 text-[10px] text-destructive font-semibold">
                      <XCircle className="w-3 h-3" /> {q.totalWrong} wrong
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] text-success">
                      <CheckCircle className="w-3 h-3" /> {q.totalRight} right
                    </span>
                    <span className="text-[10px] text-destructive font-semibold">{q.failRate}% fail</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-1 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <QuestionDetailDialog
        open={!!selectedQuestion}
        onOpenChange={(open) => !open && setSelectedQuestion(null)}
        question={selectedQuestion?.questionDef || null}
        subjectName={selectedQuestion?.subjectName || ""}
        subjectIcon={selectedQuestion?.subjectIcon || ""}
        testNumber={selectedQuestion?.examNumber || 0}
        totalWrong={selectedQuestion?.totalWrong || 0}
        totalRight={selectedQuestion?.totalRight || 0}
        failRate={selectedQuestion?.failRate || 0}
        answerDistribution={selectedQuestion?.answerDistribution}
      />
    </div>
  );
};

export default FailedQuestionsRanking;
