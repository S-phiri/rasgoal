import { useState, useEffect } from "react";
import { Grade12Subject, getGrade12SubjectTestInfo } from "@/data/grade12-questions";
import { ArrowLeft, Lock, CheckCircle, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveSubscription } from "@/hooks/useActiveSubscription";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SavedProgress {
  exam_number: number;
  current_index: number;
  score: number;
  answers: any[];
  question_order: number[];
}

interface CompletedTest {
  exam_number: number;
  score: number;
  total_questions: number;
  percentage: number;
}

interface Grade12TestSelectorProps {
  subject: Grade12Subject;
  onSelectTest: (testNumber: number, savedProgress?: SavedProgress | null) => void;
  onBack: () => void;
}

const Grade12TestSelector = ({ subject, onSelectTest, onBack }: Grade12TestSelectorProps) => {
  const { user } = useAuth();
  const { isActive } = useActiveSubscription();
  const navigate = useNavigate();
  const testInfo = getGrade12SubjectTestInfo(subject.id);
  const [savedProgressMap, setSavedProgressMap] = useState<Map<number, SavedProgress>>(new Map());
  const [completedMap, setCompletedMap] = useState<Map<number, CompletedTest>>(new Map());

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [progressRes, historyRes] = await Promise.all([
        (supabase as any)
          .from("quiz_progress")
          .select("exam_number, current_index, score, answers, question_order")
          .eq("user_id", user.id)
          .eq("subject", subject.id),
        supabase
          .from("quiz_history")
          .select("exam_number, score, total_questions, percentage")
          .eq("user_id", user.id)
          .eq("subject", subject.id)
          .order("completed_at", { ascending: false }),
      ]);

      if (progressRes.data) {
        const map = new Map<number, SavedProgress>();
        (progressRes.data as SavedProgress[]).forEach(p => map.set(p.exam_number, p));
        setSavedProgressMap(map);
      }

      if (historyRes.data) {
        const map = new Map<number, CompletedTest>();
        (historyRes.data as any[]).forEach(h => {
          if (!map.has(h.exam_number)) {
            map.set(h.exam_number, h);
          }
        });
        setCompletedMap(map);
      }
    };
    fetchData();
  }, [user, subject.id]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </button>

        <div className="text-center mb-8 animate-slide-in">
          <span className="text-5xl block mb-3">{subject.icon}</span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-1">
            {subject.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            Choose a test to begin
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-3xl w-full">
          {testInfo.map((info) => {
            const saved = savedProgressMap.get(info.testNumber);
            const completed = completedMap.get(info.testNumber);
            const isCompleted = !!completed;
            const isFreeTest = subject.id === "g12-physics" && info.testNumber === 1;
            const requiresSubscription = !isActive && !isFreeTest;

            const handleClick = () => {
              if (!info.isAvailable) return;
              if (requiresSubscription) {
                toast.info("Subscribe to unlock all tests for every subject.");
                navigate("/subscribe");
                return;
              }
              onSelectTest(info.testNumber, saved || null);
            };

            return (
              <button
                key={info.testNumber}
                onClick={handleClick}
                disabled={!info.isAvailable}
                className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-center ${
                  requiresSubscription
                    ? "border-border/60 bg-muted/40 hover:border-primary/60 hover:bg-primary/5 cursor-pointer"
                    : saved
                    ? "border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10 cursor-pointer hover:shadow-md"
                    : isCompleted
                    ? "border-success/40 bg-success/5 hover:border-success/60 hover:bg-success/10 cursor-pointer hover:shadow-md"
                    : info.isAvailable
                    ? "border-border bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer hover:shadow-md"
                    : "border-border/50 bg-muted/30 cursor-not-allowed opacity-60"
                } animate-slide-in`}
                style={{ animationDelay: `${(info.testNumber - 1) * 60}ms` }}
              >
                {requiresSubscription && (
                  <Lock className="absolute top-2 right-2 w-4 h-4 text-muted-foreground" />
                )}
                {!requiresSubscription && isCompleted && !saved && (
                  <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-success" />
                )}
                {!requiresSubscription && saved && (
                  <PlayCircle className="absolute top-2 right-2 w-4 h-4 text-primary" />
                )}

                <div className="text-2xl font-display font-bold text-foreground mb-1">
                  {info.testNumber}
                </div>

                <p className="text-xs text-muted-foreground font-medium">
                  Test {info.testNumber}
                </p>

                <p className="text-[10px] text-muted-foreground mt-1">
                  {requiresSubscription ? (
                    <span className="flex items-center justify-center gap-1 text-primary font-semibold">
                      <Lock className="w-3 h-3" /> Subscribe
                    </span>
                  ) : saved ? (
                    <span className="text-primary font-semibold">
                      Resume ({saved.current_index}/{info.questionCount})
                    </span>
                  ) : info.isAvailable ? (
                    `${info.questionCount} question${info.questionCount !== 1 ? "s" : ""}`
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> Coming soon
                    </span>
                  )}
                </p>

                {!requiresSubscription && completed && !saved && (
                  <p className={`text-[10px] font-semibold mt-1 ${
                    completed.percentage >= 60 ? "text-success" : completed.percentage >= 40 ? "text-primary" : "text-destructive"
                  }`}>
                    Last: {completed.score}/{completed.total_questions} ({completed.percentage}%)
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {testInfo.every((t) => !t.isAvailable) && (
          <div className="text-center mt-8 p-6 bg-muted/30 rounded-xl border border-border">
            <p className="text-muted-foreground text-sm">
              📚 Questions for {subject.name} are being added soon. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grade12TestSelector;
