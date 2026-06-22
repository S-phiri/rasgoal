import { useState, useMemo } from "react";
import SubjectSelector from "@/components/SubjectSelector";
import TestSelector from "@/components/TestSelector";
import QuizScreen from "@/components/QuizScreen";
import { Subject, getTestQuestions } from "@/data/questions";
import { useStreak } from "@/hooks/useStreak";
import { useRewards } from "@/hooks/useRewards";
import { useSubjectProgress } from "@/hooks/useSubjectProgress";
import { useProfile } from "@/hooks/useProfile";

interface SavedProgress {
  exam_number: number;
  current_index: number;
  score: number;
  answers: any[];
  question_order: number[];
}

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [resumeData, setResumeData] = useState<SavedProgress | null>(null);
  const streakHook = useStreak();
  const rewardsHook = useRewards();
  const progressHook = useSubjectProgress();
  const profileHook = useProfile();

  const orderedQuestions = useMemo(() => {
    if (!selectedSubject || !selectedTest) return [];
    const allQs = getTestQuestions(selectedSubject.id, selectedTest);

    // If resuming, restore the saved question order
    if (resumeData?.question_order && resumeData.question_order.length > 0) {
      const qMap = new Map(allQs.map(q => [q.id, q]));
      const ordered = resumeData.question_order
        .map(id => qMap.get(id))
        .filter(Boolean) as typeof allQs;
      // If all questions found, use saved order; otherwise fall back to shuffle
      if (ordered.length === allQs.length) return ordered;
    }

    // Shuffle for new quiz
    const qs = [...allQs];
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    return qs;
  }, [selectedSubject, selectedTest, resumeData]);

  const handleSelectTest = (testNumber: number, saved?: SavedProgress | null) => {
    setResumeData(saved || null);
    setSelectedTest(testNumber);
  };

  // Quiz screen
  if (selectedSubject && selectedTest && orderedQuestions.length > 0) {
    const nextTestNumber = selectedTest + 1;
    const nextTestQs = getTestQuestions(selectedSubject.id, nextTestNumber);
    const hasNextTest = nextTestQs.length > 0;
    // Wrap to first test if no next test exists
    const wrapTestNumber = hasNextTest ? nextTestNumber : 1;
    return (
      <QuizScreen
        key={`${selectedSubject.id}-${selectedTest}`}
        subject={selectedSubject}
        questions={orderedQuestions}
        testNumber={selectedTest}
        onBack={() => {
          setSelectedTest(null);
          setResumeData(null);
          streakHook.refetch();
          rewardsHook.refetch();
          progressHook.refetch();
        }}
        onNextTest={() => {
          streakHook.refetch();
          rewardsHook.refetch();
          progressHook.refetch();
          setResumeData(null);
          setSelectedTest(wrapTestNumber);
        }}
        streak={streakHook}
        rewards={rewardsHook}
        subjectProgress={progressHook.progress}
        avatarUrl={profileHook.profile?.avatar_url || null}
        savedProgress={resumeData ? {
          currentIndex: resumeData.current_index,
          score: resumeData.score,
          answers: resumeData.answers,
          questionOrder: resumeData.question_order,
        } : null}
      />
    );
  }

  // Test selector
  if (selectedSubject) {
    return (
      <TestSelector
        subject={selectedSubject}
        onSelectTest={handleSelectTest}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  // Subject selector
  return (
    <SubjectSelector
      onSelect={setSelectedSubject}
      streak={streakHook}
      rewards={rewardsHook}
      progress={progressHook}
      profile={profileHook}
    />
  );
};

export default Index;
