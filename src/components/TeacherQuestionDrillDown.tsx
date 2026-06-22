import { useEffect, useState, useMemo, useCallback } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { subjects, testsBySubject } from "@/data/questions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Search, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface QuestionAttempt {
  subject: string;
  question_id: string;
  first_attempt_correct: boolean;
  final_correct: boolean;
  attempts: number;
  exam_number: number;
  created_at: string;
  selected_answer?: number | null;
}

interface Props {
  attempts: QuestionAttempt[];
  studentName?: string;
  initialSubject?: string;
  initialTest?: string;
}

/**
 * Drill-down component showing question-level detail for a student's attempts.
 * Teachers can filter by subject, test, and date range.
 */
const TeacherQuestionDrillDown = ({ attempts, studentName, initialSubject, initialTest }: Props) => {
  const [subjectFilter, setSubjectFilter] = useState<string>(initialSubject || "all");
  const [testFilter, setTestFilter] = useState<string>(initialTest || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showWrongOnly, setShowWrongOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const subjectAttempts = useMemo(() => {
    return subjectFilter === "all"
      ? attempts
      : attempts.filter((attempt) => attempt.subject === subjectFilter);
  }, [attempts, subjectFilter]);

  // Get distinct subjects/tests from attempts
  const availableSubjects = useMemo(() => {
    const ids = [...new Set(attempts.map((a) => a.subject))];
    return subjects.filter((s) => ids.includes(s.id));
  }, [attempts]);

  const availableTests = useMemo(() => {
    return [...new Set(subjectAttempts.map((a) => a.exam_number))].sort((a, b) => a - b);
  }, [subjectAttempts]);

  const hasExactTestMatch = useMemo(() => {
    if (testFilter === "all") return true;
    const parsedTest = Number(testFilter);
    if (Number.isNaN(parsedTest)) return false;
    return subjectAttempts.some((attempt) => attempt.exam_number === parsedTest);
  }, [subjectAttempts, testFilter]);

  useEffect(() => {
    if (testFilter !== "all" && !hasExactTestMatch) {
      setTestFilter("all");
    }
  }, [testFilter, hasExactTestMatch]);

  // Filtered & enriched question data
  const questionDetails = useMemo(() => {
    let filtered = [...subjectAttempts];

    const parsedTest = Number(testFilter);
    if (testFilter !== "all" && !Number.isNaN(parsedTest) && filtered.some((a) => a.exam_number === parsedTest)) {
      filtered = filtered.filter((a) => a.exam_number === parsedTest);
    }
    if (dateFrom) filtered = filtered.filter((a) => a.created_at >= dateFrom);
    if (dateTo) filtered = filtered.filter((a) => a.created_at <= dateTo + "T23:59:59");

    // Enrich with question text from local data
    // exam_number now corresponds to the actual test number the student selected
    return filtered.map((a) => {
      const allQuestions = testsBySubject[a.subject]?.flat() || [];
      const qDef = allQuestions.find((q) => String(q.id) === a.question_id);
      const subj = subjects.find((s) => s.id === a.subject);
      return {
        ...a,
        questionText: qDef?.question || `Question #${a.question_id}`,
        options: qDef?.options || [],
        correctAnswer: qDef?.correctAnswer ?? -1,
        subjectName: subj?.name || a.subject,
        subjectIcon: subj?.icon || "📝",
      };
    }).filter((q) =>
      searchQuery === "" || q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter((q) =>
      !showWrongOnly || !q.first_attempt_correct
    ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [subjectAttempts, testFilter, dateFrom, dateTo, searchQuery, showWrongOnly]);

  const emptyStateMessage = useMemo(() => {
    if (subjectAttempts.length > 0) {
      return "No matching attempts found.";
    }

    if (subjectFilter !== "all") {
      const selectedSubject = subjects.find((subject) => subject.id === subjectFilter);
      return `No question-level attempts were saved for ${studentName || "this student"} in ${selectedSubject?.name || "this subject"} yet.`;
    }

    return `No question-level attempts were saved for ${studentName || "this student"} yet.`;
  }, [subjectAttempts, subjectFilter, studentName]);

  // Most failed questions (first-try failure rate)
  const mostFailed = useMemo(() => {
    const map = new Map<string, { qId: string; subject: string; exam: number; total: number; firstFail: number }>();
    attempts.forEach((a) => {
      const key = `${a.subject}-${a.exam_number}-${a.question_id}`;
      const prev = map.get(key) || { qId: a.question_id, subject: a.subject, exam: a.exam_number, total: 0, firstFail: 0 };
      prev.total++;
      if (!a.first_attempt_correct) prev.firstFail++;
      map.set(key, prev);
    });
    return [...map.values()]
      .filter((q) => q.firstFail > 0)
      .sort((a, b) => (b.firstFail / b.total) - (a.firstFail / a.total))
      .slice(0, 10)
      .map((q) => {
        const allQuestions = testsBySubject[q.subject]?.flat() || [];
        const qDef = allQuestions.find((qd) => String(qd.id) === q.qId);
        const subj = subjects.find((s) => s.id === q.subject);
        return {
          ...q,
          questionText: qDef?.question || `Question #${q.qId}`,
          options: qDef?.options || [],
          correctAnswer: qDef?.correctAnswer ?? -1,
          subjectName: subj?.name || q.subject,
          subjectIcon: subj?.icon || "📝",
          failRate: Math.round((q.firstFail / q.total) * 100),
        };
      });
  }, [attempts]);

  const handleExportExcel = useCallback(() => {
    if (questionDetails.length === 0) {
      toast.error("No questions to export");
      return;
    }

    const rows = questionDetails.map((q, i) => {
      const letters = ["A", "B", "C", "D", "E", "F"];
      const row: Record<string, string> = {
        "#": String(i + 1),
        "Question": q.questionText,
      };
      q.options.forEach((opt, idx) => {
        row[`Option ${letters[idx] || String(idx + 1)}`] = opt;
      });
      row["Correct Answer"] = letters[q.correctAnswer] || String(q.correctAnswer);
      row["Subject"] = q.subjectName;
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");

    // Auto-size columns
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => (r[key] || "").length)).valueOf(),
    }));
    ws["!cols"] = colWidths.map((w) => ({ wch: Math.min(w.wch + 2, 80) }));

    const filterDesc = [
      subjectFilter !== "all" ? subjects.find((s) => s.id === subjectFilter)?.name : "All Subjects",
      testFilter !== "all" ? `Test #${testFilter}` : "All Tests",
    ].join(" - ");

    XLSX.writeFile(wb, `Questions_${filterDesc.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(`Exported ${rows.length} questions`);
  }, [questionDetails, subjectFilter, testFilter]);

  return (
    <div className="space-y-6">
      {/* Most Failed Questions Section */}
      {mostFailed.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            🔥 Questions Most Failed on First Try
          </h3>
          <div className="space-y-2">
            {mostFailed.map((q, i) => (
              <div key={`${q.subject}-${q.exam}-${q.qId}`} className="rounded-lg border border-border p-3 bg-background">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-bold text-destructive min-w-[2rem] text-center pt-0.5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug mb-2">{q.questionText}</p>

                    {/* Options with correct answer highlighted */}
                    {q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-2">
                        {q.options.map((opt, idx) => {
                          const isCorrect = idx === q.correctAnswer;
                          return (
                            <div
                              key={idx}
                              className={`text-xs px-2 py-1 rounded flex items-center gap-1.5 ${
                                isCorrect
                                  ? "bg-success/10 text-success font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {isCorrect && <CheckCircle className="w-3 h-3 shrink-0" />}
                              <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[10px]">{q.subjectIcon} {q.subjectName}</Badge>
                      <Badge variant="outline" className="text-[10px]">Test #{q.exam}</Badge>
                      <span className="text-[10px] text-destructive font-semibold">{q.failRate}% fail rate</span>
                      <span className="text-[10px] text-muted-foreground">({q.firstFail}/{q.total} attempts)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-display font-bold text-sm text-foreground">🔍 Question-Level Detail</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-1 text-xs h-7" disabled={questionDetails.length === 0}>
              <Download className="w-3 h-3" /> Export Excel
            </Button>
            <ToggleGroup
              type="single"
              value={showWrongOnly ? "wrong" : "all"}
              onValueChange={(v) => setShowWrongOnly(v === "wrong")}
              variant="outline"
              size="sm"
            >
              <ToggleGroupItem value="all" className="text-xs px-3 h-7">All</ToggleGroupItem>
              <ToggleGroupItem value="wrong" className="text-xs px-3 h-7 data-[state=on]:bg-destructive/10 data-[state=on]:text-destructive">Wrong Only</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
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

          <Select value={testFilter} onValueChange={setTestFilter}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Tests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tests</SelectItem>
              {availableTests.map((t) => (
                <SelectItem key={t} value={String(t)}>Test #{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 text-xs" placeholder="From" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 text-xs" placeholder="To" />

          <div className="relative col-span-2 md:col-span-1">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
        </div>

        {/* Results */}
        <p className="text-xs text-muted-foreground mb-3">{questionDetails.length} question attempts</p>

        {testFilter !== "all" && !hasExactTestMatch && subjectAttempts.length > 0 && (
          <p className="text-xs text-muted-foreground mb-3">
            No exact question log was found for that test number, so all saved {subjectFilter === "all" ? "question" : "subject"} attempts are shown.
          </p>
        )}

        {questionDetails.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm">{emptyStateMessage}</p>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {questionDetails.map((q, i) => (
              <div key={`${q.subject}-${q.exam_number}-${q.question_id}-${i}`} className="rounded-lg border border-border p-3 bg-background">
                {/* Question text */}
                <p className="text-sm font-medium text-foreground mb-2">{q.questionText}</p>

                {/* Answer options (if available) */}
                {q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-2">
                    {q.options.map((opt, idx) => {
                      const isCorrect = idx === q.correctAnswer;
                      const isStudentWrongChoice = !isCorrect && q.selected_answer === idx;
                      return (
                        <div
                          key={idx}
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1.5 ${
                            isCorrect
                              ? "bg-success/10 text-success font-medium"
                              : isStudentWrongChoice
                              ? "bg-destructive/10 text-destructive font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {isCorrect && <CheckCircle className="w-3 h-3 shrink-0" />}
                          {isStudentWrongChoice && <XCircle className="w-3 h-3 shrink-0" />}
                          <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                          {isStudentWrongChoice && <span className="text-[10px] ml-auto">(Student's answer)</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Metadata row */}
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <Badge variant="outline" className="text-[10px]">{q.subjectIcon} {q.subjectName}</Badge>
                  <Badge variant="outline" className="text-[10px]">Test #{q.exam_number}</Badge>

                  {q.first_attempt_correct ? (
                    <Badge className="bg-success/10 text-success border-success/30 text-[10px]">
                      <CheckCircle className="w-2.5 h-2.5 mr-0.5" /> 1st try ✓
                    </Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]">
                      <XCircle className="w-2.5 h-2.5 mr-0.5" /> 1st try ✗
                    </Badge>
                  )}

                  {q.final_correct ? (
                    <Badge className="bg-success/10 text-success border-success/30 text-[10px]">Final: Correct</Badge>
                  ) : (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]">Final: Wrong</Badge>
                  )}

                  <span className="text-muted-foreground">{q.attempts} attempt{q.attempts !== 1 ? "s" : ""}</span>
                  <span className="text-muted-foreground">{new Date(q.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherQuestionDrillDown;
