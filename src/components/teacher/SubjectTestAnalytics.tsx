import { useState, useMemo } from "react";
import { subjects, getSubjectTestInfo } from "@/data/questions";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";
import TestParticipationCard from "./TestParticipationCard";
import FailedQuestionsRanking from "./FailedQuestionsRanking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BarChart3 } from "lucide-react";

interface Props {
  studentIds: string[];
}

const SubjectTestAnalytics = ({ studentIds }: Props) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const { quizHistory, questionAttempts, studentProfiles, loading } = useTeacherAnalytics(studentIds);

  const testInfo = useMemo(() => {
    if (!selectedSubject) return [];
    return getSubjectTestInfo(selectedSubject);
  }, [selectedSubject]);

  const testParticipation = useMemo(() => {
    if (!selectedSubject) return [];

    return testInfo
      .filter((t) => t.isAvailable)
      .map((t) => {
        const takenIds = new Set(
          quizHistory
            .filter((q) => q.subject === selectedSubject && q.exam_number === t.testNumber)
            .map((q) => q.user_id)
        );

        const takenStudents = studentIds
          .filter((id) => takenIds.has(id))
          .map((id) => studentProfiles.get(id) || { user_id: id, full_name: null, avatar_url: null, grade: null, school: null });

        const notTakenStudents = studentIds
          .filter((id) => !takenIds.has(id))
          .map((id) => studentProfiles.get(id) || { user_id: id, full_name: null, avatar_url: null, grade: null, school: null });

        const scores = quizHistory
          .filter((q) => q.subject === selectedSubject && q.exam_number === t.testNumber)
          .map((q) => q.percentage);
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

        return { ...t, takenStudents, notTakenStudents, avgScore };
      });
  }, [selectedSubject, testInfo, quizHistory, studentIds, studentProfiles]);

  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject);

  if (loading && studentIds.length > 0) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-muted-foreground mt-2">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Subject selector */}
      <div>
        <h2 className="font-display font-bold text-foreground mb-3">📊 Subject Analytics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubject(selectedSubject === s.id ? null : s.id)}
              className={`p-3 rounded-xl border text-center transition-all text-xs font-medium ${
                selectedSubject === s.id
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/30"
              }`}
            >
              <span className="text-lg block mb-1">{s.icon}</span>
              <span className="line-clamp-1">{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected subject content */}
      {selectedSubject && selectedSubjectData && (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">{selectedSubjectData.icon}</span>
            <h3 className="font-display font-bold text-foreground">{selectedSubjectData.name}</h3>
          </div>

          <Tabs defaultValue="participation" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 max-w-sm">
              <TabsTrigger value="participation" className="gap-1 text-xs">
                <BookOpen className="w-3.5 h-3.5" /> Test Participation
              </TabsTrigger>
              <TabsTrigger value="failed" className="gap-1 text-xs">
                <BarChart3 className="w-3.5 h-3.5" /> Failed Questions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participation">
              {testParticipation.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No available tests for this subject.</p>
              ) : (
                <div className="space-y-2">
                  {testParticipation.map((t) => (
                    <TestParticipationCard
                      key={t.testNumber}
                      testNumber={t.testNumber}
                      questionCount={t.questionCount}
                      takenStudents={t.takenStudents}
                      notTakenStudents={t.notTakenStudents}
                      avgScore={t.avgScore}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="failed">
              <FailedQuestionsRanking
                attempts={questionAttempts}
                initialSubject={selectedSubject}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SubjectTestAnalytics;
