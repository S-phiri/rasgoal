import { useState, useCallback, useRef, useEffect } from "react";
import { Question, Subject } from "@/data/questions";
import { QuestionVisual, OptionShapeVisual } from "@/components/QuestionVisual";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Flame, Save, Clock, BookOpen, ChevronDown, Atom } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PeriodicTable from "@/components/PeriodicTable";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CelebrationAnimation from "@/components/CelebrationAnimation";
import { toast } from "sonner";
import type { useStreak } from "@/hooks/useStreak";
import type { useRewards } from "@/hooks/useRewards";
import type { SubjectProgressData } from "@/hooks/useSubjectProgress";
import type { RewardDefinition } from "@/lib/rewards";

interface QuizScreenProps {
  subject: Subject;
  questions: Question[];
  testNumber?: number;
  onBack: () => void;
  onNextTest?: () => void;
  streak: ReturnType<typeof useStreak>;
  rewards: ReturnType<typeof useRewards>;
  subjectProgress: Record<string, SubjectProgressData>;
  avatarUrl: string | null;
  savedProgress?: {
    currentIndex: number;
    score: number;
    answers: Array<{ questionId: string; correct: boolean; selectedAnswer: number }>;
    questionOrder: number[];
  } | null;
}

const QuizScreen = ({ subject, questions, testNumber, onBack, onNextTest, streak, rewards, subjectProgress, avatarUrl, savedProgress }: QuizScreenProps) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(savedProgress?.currentIndex ?? 0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(savedProgress?.score ?? 0);
  const [finished, setFinished] = useState(false);
  const [celebration, setCelebration] = useState<{
    type: "correct" | "streak" | "reward" | "complete";
    reward?: RewardDefinition;
    message?: string;
  } | null>(null);

  const QUIZ_DURATION_SECONDS = 50 * 60;
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [timeUp, setTimeUp] = useState(false);

  const questionAttemptsRef = useRef<Array<{ questionId: string; correct: boolean; selectedAnswer: number }>>(
    savedProgress?.answers ?? []
  );

  const saveProgress = useCallback(async () => {
    if (!user || !testNumber) return;
    const questionOrder = questions.map(q => q.id);
    await (supabase as any).from("quiz_progress").upsert({
      user_id: user.id,
      subject: subject.id,
      exam_number: testNumber,
      current_index: currentIndex + (showResult ? 1 : 0),
      score,
      answers: questionAttemptsRef.current,
      question_order: questionOrder,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,subject,exam_number" });
    toast.success("Progress saved! You can resume later.");
  }, [user, subject.id, testNumber, currentIndex, score, showResult, questions]);

  const deleteProgress = useCallback(async () => {
    if (!user || !testNumber) return;
    await (supabase as any).from("quiz_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("subject", subject.id)
      .eq("exam_number", testNumber);
  }, [user, subject.id, testNumber]);

  const question = questions[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / questions.length) * 100;
  const isCorrect = selectedAnswer === question?.correctAnswer;

  const handleSelect = useCallback((index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const correct = index === question.correctAnswer;
    if (correct) {
      setScore((s) => s + 1);
    }
    questionAttemptsRef.current.push({
      questionId: String(question.id),
      correct,
      selectedAnswer: index,
    });
  }, [showResult, question]);

  const handleFinish = useCallback(async () => {
    if (!user) return;
    const actualScore = score;

    // Delete saved progress since quiz is complete
    await deleteProgress();

    const actualTestNumber = testNumber ?? 1;

    await supabase.from("quiz_history").insert({
      user_id: user.id,
      subject: subject.id,
      score: actualScore,
      total_questions: questions.length,
      percentage: Math.round((actualScore / questions.length) * 100),
      exam_number: actualTestNumber,
    } as any);

    const attemptInserts = questionAttemptsRef.current.map((a) => ({
      user_id: user.id,
      subject: subject.id,
      question_id: a.questionId,
      first_attempt_correct: a.correct,
      final_correct: a.correct,
      attempts: 1,
      exam_number: actualTestNumber,
      selected_answer: a.selectedAnswer,
    }));

    if (attemptInserts.length > 0) {
      const { error: attemptError } = await (supabase as any).from("question_attempts").insert(attemptInserts);
      if (attemptError) {
        console.error("Failed to save question attempts:", attemptError);
        toast.error("Some question details could not be saved.");
      }
    }

    const updatedStreak = await streak.recordActivity(actualScore);

    const { count } = await supabase
      .from("quiz_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const { data: allHistory } = await supabase
      .from("quiz_history")
      .select("subject, score")
      .eq("user_id", user.id);

    const subjectProg: Record<string, number> = {};
    if (allHistory) {
      const bySubject: Record<string, number> = {};
      (allHistory as any[]).forEach((h) => {
        bySubject[h.subject] = (bySubject[h.subject] || 0) + h.score;
      });
      Object.entries(bySubject).forEach(([s, total]) => {
        subjectProg[s] = Math.min(total / 50, 1);
      });
    }

    const newRewards = await rewards.checkAndAward({
      streakDays: updatedStreak?.current_streak || 0,
      totalCorrect: updatedStreak?.total_correct_answers || 0,
      quizScore: actualScore,
      quizTotal: questions.length,
      quizCount: count || 1,
      subjectProgress: subjectProg,
    });

    if (newRewards && newRewards.length > 0) {
      setCelebration({ type: "reward", reward: newRewards[0] });
    }
  }, [user, score, selectedAnswer, question, subject, questions, streak, rewards, deleteProgress]);

  const handleNext = useCallback(async () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      await handleFinish();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentIndex, questions.length, handleFinish]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    setTimeUp(false);
    questionAttemptsRef.current = [];
  }, [QUIZ_DURATION_SECONDS]);

  // Countdown timer
  useEffect(() => {
    if (finished) return;
    if (timeLeft <= 0) return;
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [finished, timeLeft]);

  // Auto-finish when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      setTimeUp(true);
      setFinished(true);
      handleFinish();
    }
  }, [timeLeft, finished, handleFinish]);

  const handleSaveAndExit = useCallback(async () => {
    await saveProgress();
    onBack();
  }, [saveProgress, onBack]);

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "👍" : percentage >= 40 ? "📚" : "💪";
    const message = percentage >= 80 ? "Excellent work!" : percentage >= 60 ? "Good job!" : percentage >= 40 ? "Keep practicing!" : "Don't give up!";

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {celebration && (
          <CelebrationAnimation
            type={celebration.type}
            reward={celebration.reward}
            message={celebration.message}
            onDone={() => setCelebration(null)}
          />
        )}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8 max-w-md w-full text-center animate-slide-in">
          <span className="text-6xl block mb-4">{emoji}</span>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {timeUp ? "Time's Up!" : "Quiz Complete!"}
          </h2>
          <p className="text-muted-foreground mb-4">{subject.name} — {message}</p>
          {timeUp && (
            <p className="text-xs text-destructive mb-3">The 50-minute timer ran out. Your test was submitted automatically.</p>
          )}

          {streak.streak && (
            <div className="flex items-center justify-center gap-2 mb-4 text-sm">
              <Flame className="w-4 h-4 text-destructive" />
              <span className="text-foreground font-semibold">
                {streak.streak.current_streak} day streak
              </span>
            </div>
          )}

          {rewards.newRewards.length > 0 && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-secondary mb-2">🎉 New Rewards Earned!</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {rewards.newRewards.map((r) => (
                  <span key={r.id} className="text-2xl" title={r.name}>
                    {r.icon}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-muted rounded-xl p-6 mb-6">
            <div className="text-5xl font-display font-bold text-primary mb-1">{score}/{questions.length}</div>
            <div className="text-muted-foreground">{percentage}% correct</div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onBack}>
              <RotateCcw className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleRestart}>
              Try Again
            </Button>
          </div>
          {onNextTest && (
            <Button className="w-full mt-3" onClick={onNextTest}>
              Next Test <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-2xl mx-auto">
      {celebration && (
        <CelebrationAnimation
          type={celebration.type}
          reward={celebration.reward}
          message={celebration.message}
          onDone={() => setCelebration(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <button onClick={handleSaveAndExit} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1">
          <Save className="w-3.5 h-3.5" /> Save & Exit
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {subject.icon} {subject.name}
        </span>
        <div className="flex items-center gap-2">
          {streak.streak && streak.streak.current_streak > 0 && (
            <span className="flex items-center gap-1 text-xs text-destructive">
              <Flame className="w-3 h-3" /> {streak.streak.current_streak}
            </span>
          )}
          <span className="text-sm font-display font-bold text-primary">
            {score} pts
          </span>
        </div>
      </div>

      {subject.id === "g12-chemistry" && (
        <div className="flex justify-center mb-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Atom className="w-4 h-4" />
                Periodic Table
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] p-4">
              <DialogHeader>
                <DialogTitle className="font-display">Periodic Table of the Elements</DialogTitle>
                <DialogDescription>Reference chart — pinch or scroll to zoom.</DialogDescription>
              </DialogHeader>
              <div className="overflow-auto max-h-[75vh] bg-white rounded-md p-3">
                <PeriodicTable />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className={`flex items-center justify-center gap-2 mb-3 text-sm font-display font-bold ${timeLeft <= 60 ? "text-destructive animate-pulse" : timeLeft <= 300 ? "text-destructive" : "text-foreground"}`}>
        <Clock className="w-4 h-4" />
        <span>
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
        </span>
      </div>

      <div className="mb-1">
        <Progress value={progress} className="h-2.5" />
      </div>
      <p className="text-xs text-muted-foreground mb-8 text-right">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="flex-1">
        {question.passage && (
          <Collapsible defaultOpen className="mb-4">
            <div className="bg-accent/5 border border-accent/30 rounded-2xl overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between p-3 hover:bg-accent/10 transition-colors">
                <span className="flex items-center gap-2 font-display font-semibold text-sm text-foreground">
                  <BookOpen className="w-4 h-4 text-accent" />
                  {question.passageTitle || "Reading Passage"}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="max-h-64 overflow-y-auto px-4 py-3 text-sm leading-relaxed text-foreground whitespace-pre-line border-t border-accent/20">
                  {question.passage}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mb-6 animate-slide-in" key={currentIndex}>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground leading-relaxed">
            {question.question}
          </h2>
          {question.image && (
            <div className="mt-4 flex justify-center">
              <img src={question.image} alt="Question diagram" className="max-w-full max-h-64 rounded-lg border border-border" />
            </div>
          )}
          {question.visual && (
            <div className="mt-4">
              <QuestionVisual visual={question.visual} />
            </div>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, i) => {
            let optionClass = "bg-card border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer";

            if (showResult) {
              if (i === question.correctAnswer) {
                optionClass = "bg-success/10 border-success cursor-default";
              } else if (i === selectedAnswer && !isCorrect) {
                optionClass = "bg-destructive/10 border-destructive cursor-default";
              } else {
                optionClass = "bg-card border-border opacity-50 cursor-default";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${optionClass}`}
              >
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-display font-bold text-muted-foreground shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="font-medium text-foreground flex-1">
                  {question.visual?.options && question.visual.options[i] ? (
                    <OptionShapeVisual shapes={question.visual.options[i]} />
                  ) : (
                    option
                  )}
                </span>
                {showResult && i === question.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-success shrink-0" />
                )}
                {showResult && i === selectedAnswer && !isCorrect && i !== question.correctAnswer && (
                  <XCircle className="w-5 h-5 text-destructive shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`rounded-xl p-4 mb-6 animate-slide-in ${isCorrect ? "bg-success/10 border border-success/30" : "bg-secondary/50 border border-secondary"}`}>
            <p className="text-sm font-semibold mb-1 text-foreground">
              {isCorrect ? "✨ Correct!" : "💡 Learning Tip:"}
            </p>
            <p className="text-sm text-muted-foreground">{question.tip}</p>
          </div>
        )}

        {showResult && (
          <Button onClick={handleNext} className="w-full py-6 text-base font-semibold animate-slide-in">
            {currentIndex + 1 >= questions.length ? "See Results" : "Next Question"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;
