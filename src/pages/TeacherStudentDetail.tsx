import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { subjects, questionsBySubject } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, BookOpen, TrendingUp, AlertTriangle, MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import TeacherQuestionDrillDown from "@/components/TeacherQuestionDrillDown";

import DirectChat from "@/components/DirectChat";

interface StudentProfile {
  full_name: string | null;
  avatar_url: string | null;
  grade: string | null;
  school: string | null;
}

interface QuizRecord {
  id: string;
  subject: string;
  score: number;
  total_questions: number;
  percentage: number;
  exam_number: number;
  completed_at: string;
}

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

const COLORS = ["hsl(168, 60%, 38%)", "hsl(38, 80%, 55%)", "hsl(250, 60%, 62%)", "hsl(0, 72%, 55%)", "hsl(145, 60%, 42%)"];

const TeacherStudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizRecord[]>([]);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("subjects");
  const [drillSubject, setDrillSubject] = useState<string | undefined>();
  const [drillTest, setDrillTest] = useState<string | undefined>();
  const [studentAssignments, setStudentAssignments] = useState<{ id: string; test_title: string; status: string }[]>([]);

  const handleQuizRowClick = (subject: string, examNumber: number) => {
    const hasExactAttemptMatch = attempts.some(
      (attempt) => attempt.subject === subject && attempt.exam_number === examNumber,
    );

    setDrillSubject(subject);
    setDrillTest(hasExactAttemptMatch ? String(examNumber) : undefined);
    setActiveTab("questions");
  };

  useEffect(() => {
    if (!user || !studentId) return;
    const load = async () => {
      const [profileRes, quizRes, attemptRes] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url, grade, school").eq("user_id", studentId).maybeSingle(),
        supabase.from("quiz_history").select("*").eq("user_id", studentId).order("completed_at", { ascending: false }),
        supabase.from("question_attempts").select("*").eq("user_id", studentId).order("created_at", { ascending: false }),
      ]);
      setProfile(profileRes.data as any);
      setQuizHistory((quizRes.data || []) as QuizRecord[]);
      setAttempts((attemptRes.data || []) as QuestionAttempt[]);

      // Fetch assignments for this student that belong to the teacher's tests
      const { data: teacherTests } = await supabase
        .from("custom_tests")
        .select("id, title")
        .eq("teacher_id", user.id);
      if (teacherTests && teacherTests.length > 0) {
        const testIds = teacherTests.map((t) => t.id);
        const testMap = new Map(teacherTests.map((t) => [t.id, t.title]));
        const { data: assigns } = await supabase
          .from("test_assignments")
          .select("id, test_id, status")
          .eq("student_id", studentId)
          .in("test_id", testIds);
        setStudentAssignments(
          (assigns || []).map((a: any) => ({
            id: a.id,
            test_title: testMap.get(a.test_id) || "Test",
            status: a.status,
          }))
        );
      }

      setLoading(false);
    };
    load();
  }, [user, studentId]);

  const subjectStats = useMemo(() => {
    return subjects.map((s) => {
      const quizzes = quizHistory.filter((q) => q.subject === s.id);
      const subAttempts = attempts.filter((a) => a.subject === s.id);
      const totalQ = questionsBySubject[s.id]?.length || 50;
      const correctFirst = subAttempts.filter((a) => a.first_attempt_correct).length;
      const totalAttempts = subAttempts.length;
      const avgScore = quizzes.length > 0 ? Math.round(quizzes.reduce((a, q) => a + q.percentage, 0) / quizzes.length) : 0;
      const uniqueCorrect = new Set(subAttempts.filter((a) => a.final_correct).map((a) => a.question_id)).size;

      return {
        id: s.id,
        name: s.name,
        icon: s.icon,
        quizzesTaken: quizzes.length,
        avgScore,
        correctFirst,
        totalAttempts,
        firstTryRate: totalAttempts > 0 ? Math.round((correctFirst / totalAttempts) * 100) : 0,
        progress: Math.round((uniqueCorrect / totalQ) * 100),
        totalCorrect: uniqueCorrect,
        totalAvailable: totalQ,
      };
    }).filter((s) => s.quizzesTaken > 0 || s.totalAttempts > 0);
  }, [quizHistory, attempts]);

  const overallStats = useMemo(() => {
    const total = quizHistory.length;
    const avg = total > 0 ? Math.round(quizHistory.reduce((a, q) => a + q.percentage, 0) / total) : 0;
    const firstCorrect = attempts.filter((a) => a.first_attempt_correct).length;
    const firstWrong = attempts.filter((a) => !a.first_attempt_correct).length;
    return { totalQuizzes: total, avgScore: avg, firstCorrect, firstWrong, totalAttempts: attempts.length };
  }, [quizHistory, attempts]);

  const weakTopics = useMemo(() => {
    return [...subjectStats]
      .filter((s) => s.totalAttempts > 0)
      .sort((a, b) => a.firstTryRate - b.firstTryRate)
      .slice(0, 3);
  }, [subjectStats]);

  const trendData = useMemo(() => {
    const sorted = [...quizHistory].sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());
    return sorted.slice(-20).map((q, i) => ({
      quiz: i + 1,
      score: q.percentage,
      subject: q.subject,
    }));
  }, [quizHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teacher")} className="mb-3 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
              <AvatarFallback className="text-lg bg-primary/10 text-primary font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || "S"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">
                {profile?.full_name || "Student"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile?.grade ? `Grade ${profile.grade}` : ""}
                {profile?.school ? ` · ${profile.school}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Quizzes", value: overallStats.totalQuizzes, icon: BookOpen, color: "text-primary" },
            { label: "Avg Score", value: `${overallStats.avgScore}%`, icon: TrendingUp, color: "text-success" },
            { label: "1st Try ✓", value: overallStats.firstCorrect, icon: Target, color: "text-accent" },
            { label: "1st Try ✗", value: overallStats.firstWrong, icon: AlertTriangle, color: "text-destructive" },
            { label: "1st Try Rate", value: `${overallStats.totalAttempts > 0 ? Math.round((overallStats.firstCorrect / overallStats.totalAttempts) * 100) : 0}%`, icon: Target, color: "text-secondary" },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
              <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
              <p className="text-xl font-bold font-display text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Weak areas alert */}
        {weakTopics.length > 0 && weakTopics[0].firstTryRate < 60 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h3 className="font-display font-bold text-sm text-foreground">Areas Needing Attention</h3>
            </div>
            <div className="space-y-1">
              {weakTopics.filter((t) => t.firstTryRate < 60).map((t) => (
                <p key={t.id} className="text-sm text-muted-foreground">
                  {t.icon} <span className="font-medium text-foreground">{t.name}</span> — {t.firstTryRate}% first-try success rate
                </p>
              ))}
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="quizzes">Quiz History</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" /> Messages
              {studentAssignments.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{studentAssignments.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Subjects tab */}
          <TabsContent value="subjects" className="space-y-4 mt-4">
            {subjectStats.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No subject data yet.</p>
            ) : (
              <>
                {/* Bar chart */}
                <div className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-display font-bold text-sm text-foreground mb-3">Average Score by Subject</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={subjectStats}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="avgScore" fill="hsl(168, 60%, 38%)" radius={[4, 4, 0, 0]} name="Avg %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* First try pie chart */}
                <div className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-display font-bold text-sm text-foreground mb-3">First-Try Accuracy</h3>
                  <div className="flex items-center justify-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie data={[
                          { name: "Correct", value: overallStats.firstCorrect },
                          { name: "Wrong", value: overallStats.firstWrong },
                        ]} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                          <Cell fill="hsl(145, 60%, 42%)" />
                          <Cell fill="hsl(0, 72%, 55%)" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-foreground">Correct: {overallStats.firstCorrect}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-foreground">Wrong: {overallStats.firstWrong}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject breakdown */}
                <div className="space-y-3">
                  {subjectStats.map((s) => (
                    <div key={s.id} className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{s.icon}</span>
                          <h4 className="font-display font-bold text-sm text-foreground">{s.name}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">{s.quizzesTaken} quizzes</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center mb-3">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="font-bold text-foreground">{s.avgScore}%</p>
                          <p className="text-[10px] text-muted-foreground">Avg Score</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="font-bold text-foreground">{s.firstTryRate}%</p>
                          <p className="text-[10px] text-muted-foreground">1st Try Rate</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2">
                          <p className="font-bold text-foreground">{s.totalCorrect}/{s.totalAvailable}</p>
                          <p className="text-[10px] text-muted-foreground">Correct</p>
                        </div>
                      </div>
                      <Progress value={s.progress} className="h-2" />
                      <p className="text-[10px] text-muted-foreground mt-1">{s.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Quiz history tab */}
          <TabsContent value="quizzes" className="mt-4">
            {quizHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No quizzes taken yet.</p>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2 font-display font-semibold text-foreground">Subject</th>
                        <th className="text-center px-4 py-2 font-display font-semibold text-foreground">Score</th>
                        <th className="text-center px-4 py-2 font-display font-semibold text-foreground">%</th>
                        <th className="text-center px-4 py-2 font-display font-semibold text-foreground">Exam #</th>
                        <th className="text-right px-4 py-2 font-display font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizHistory.map((q) => {
                        const subj = subjects.find((s) => s.id === q.subject);
                        return (
                          <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer" onClick={() => handleQuizRowClick(q.subject, q.exam_number)}>
                            <td className="px-4 py-2.5">
                              <span className="mr-1">{subj?.icon}</span>
                              {subj?.name || q.subject}
                            </td>
                            <td className="text-center px-4 py-2.5 font-mono">{q.score}/{q.total_questions}</td>
                            <td className="text-center px-4 py-2.5">
                              <span className={`font-bold ${q.percentage >= 70 ? "text-success" : q.percentage >= 50 ? "text-secondary" : "text-destructive"}`}>
                                {q.percentage}%
                              </span>
                            </td>
                            <td className="text-center px-4 py-2.5 text-muted-foreground">#{q.exam_number}</td>
                            <td className="text-right px-4 py-2.5 text-muted-foreground">
                              {new Date(q.completed_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Questions drill-down tab */}
          <TabsContent value="questions" className="mt-4">
            <TeacherQuestionDrillDown
              key={`${drillSubject}-${drillTest}`}
              attempts={attempts as any}
              studentName={profile?.full_name || "Student"}
              initialSubject={drillSubject}
              initialTest={drillTest}
            />
          </TabsContent>

          {/* Trends tab */}
          <TabsContent value="trends" className="mt-4 space-y-4">
            {trendData.length < 2 ? (
              <p className="text-center text-muted-foreground py-8">Need at least 2 quizzes to show trends.</p>
            ) : (
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-display font-bold text-sm text-foreground mb-3">Score Trend (Last 20 Quizzes)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <XAxis dataKey="quiz" tick={{ fontSize: 11 }} label={{ value: "Quiz #", position: "insideBottom", offset: -2, fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="hsl(168, 60%, 38%)" strokeWidth={2} dot={{ fill: "hsl(168, 60%, 38%)", r: 3 }} name="Score %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* First-try rate by subject */}
            {subjectStats.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="font-display font-bold text-sm text-foreground mb-3">First-Try Success Rate by Subject</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={subjectStats}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="firstTryRate" name="1st Try %" radius={[4, 4, 0, 0]}>
                      {subjectStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </TabsContent>

          {/* Messages tab */}
          <TabsContent value="messages" className="space-y-6 mt-4">
            {/* Direct messages (no assignment needed) */}
            <div>
              <h3 className="font-display font-bold text-sm text-foreground mb-3">Direct Messages</h3>
              <DirectChat
                otherUserId={studentId!}
                otherUserName={profile?.full_name || "Student"}
                inline
              />
            </div>

            {/* Assignment-specific chats */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherStudentDetail;
