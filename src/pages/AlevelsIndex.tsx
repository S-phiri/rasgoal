import { useState, useMemo } from "react";
import AlevelsSubjectSelector from "@/components/AlevelsSubjectSelector";
import AlevelsTestSelector from "@/components/AlevelsTestSelector";
import QuizScreen from "@/components/QuizScreen";
import { AlevelsSubject, getAlevelsTestQuestions } from "@/data/alevels-questions";
import { useStreak } from "@/hooks/useStreak";
import { useRewards } from "@/hooks/useRewards";
import { useProfile } from "@/hooks/useProfile";

interface SavedProgress {
  exam_number: number;
  current_index: number;
  score: number;
  answers: any[];
  question_order: number[];
}

const AlevelsIndex = () => {
  const [selectedSubject, setSelectedSubject] = useState<AlevelsSubject | null>(null);
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [resumeData, setResumeData] = useState<SavedProgress | null>(null);
  const streakHook = useStreak();
  const rewardsHook = useRewards();
  const profileHook = useProfile();

  const orderedQuestions = useMemo(() => {
    if (!selectedSubject || !selectedTest) return [];
    const allQs = getAlevelsTestQuestions(selectedSubject.id, selectedTest);

    if (resumeData?.question_order && resumeData.question_order.length > 0) {
      const qMap = new Map(allQs.map(q => [q.id, q]));
      const ordered = resumeData.question_order
        .map(id => qMap.get(id))
        .filter(Boolean) as typeof allQs;
      if (ordered.length === allQs.length) return ordered;
    }

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

  if (selectedSubject && selectedTest && orderedQuestions.length > 0) {
    const nextTestNumber = selectedTest + 1;
    const nextTestQs = getAlevelsTestQuestions(selectedSubject.id, nextTestNumber);
    const hasNextTest = nextTestQs.length > 0;
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
        }}
        onNextTest={() => {
          streakHook.refetch();
          rewardsHook.refetch();
          setResumeData(null);
          setSelectedTest(wrapTestNumber);
        }}
        streak={streakHook}
        rewards={rewardsHook}
        subjectProgress={{}}
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

  if (selectedSubject) {
    return (
      <AlevelsTestSelector
        subject={selectedSubject}
        onSelectTest={handleSelectTest}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <AlevelsSubjectSelector
      onSelect={setSelectedSubject}
      streak={streakHook}
      rewards={rewardsHook}
      profile={profileHook}
    />
  );
};

export default AlevelsIndex;
