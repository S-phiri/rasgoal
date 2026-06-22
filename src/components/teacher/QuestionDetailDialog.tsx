import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users } from "lucide-react";
import type { Question } from "@/data/questions/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  subjectName: string;
  subjectIcon: string;
  testNumber: number;
  totalWrong: number;
  totalRight: number;
  failRate: number;
  answerDistribution?: Record<number, number>;
}

const QuestionDetailDialog = ({
  open, onOpenChange, question, subjectName, subjectIcon,
  testNumber, totalWrong, totalRight, failRate, answerDistribution,
}: Props) => {
  if (!question) return null;

  const total = totalWrong + totalRight;
  const maxPicks = answerDistribution
    ? Math.max(...Object.values(answerDistribution), 1)
    : 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Question Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metadata */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{subjectIcon} {subjectName}</Badge>
            <Badge variant="outline" className="text-xs">Test #{testNumber}</Badge>
            <Badge variant="outline" className="text-xs">Q#{question.id}</Badge>
          </div>

          {/* Question */}
          <p className="text-sm font-medium text-foreground leading-relaxed">{question.question}</p>

          {/* Options with answer distribution */}
          <div className="space-y-1.5">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.correctAnswer;
              const picks = answerDistribution?.[idx] || 0;
              const barWidth = answerDistribution ? Math.round((picks / maxPicks) * 100) : 0;
              const isWronglyPicked = !isCorrect && picks > 0;

              return (
                <div
                  key={idx}
                  className={`text-sm px-3 py-2 rounded-lg relative overflow-hidden ${
                    isCorrect
                      ? "border border-success/30 text-success font-medium"
                      : isWronglyPicked
                      ? "border border-destructive/30 text-destructive font-medium"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {/* Background bar showing pick distribution */}
                  {answerDistribution && picks > 0 && (
                    <div
                      className={`absolute inset-y-0 left-0 ${
                        isCorrect ? "bg-success/10" : "bg-destructive/10"
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  )}
                  <div className="relative flex items-center gap-2">
                    {isCorrect && <CheckCircle className="w-4 h-4 shrink-0" />}
                    {isWronglyPicked && <XCircle className="w-4 h-4 shrink-0" />}
                    <span className="flex-1">{String.fromCharCode(65 + idx)}. {opt}</span>
                    {answerDistribution && picks > 0 && (
                      <span className={`text-[10px] font-semibold shrink-0 ${
                        isCorrect ? "text-success" : "text-destructive"
                      }`}>
                        {picks} student{picks !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-destructive/5 rounded-lg p-3 text-center">
              <XCircle className="w-4 h-4 text-destructive mx-auto mb-1" />
              <p className="text-lg font-bold text-destructive">{totalWrong}</p>
              <p className="text-[10px] text-muted-foreground">Got Wrong</p>
            </div>
            <div className="bg-success/5 rounded-lg p-3 text-center">
              <CheckCircle className="w-4 h-4 text-success mx-auto mb-1" />
              <p className="text-lg font-bold text-success">{totalRight}</p>
              <p className="text-[10px] text-muted-foreground">Got Right</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <Users className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{failRate}%</p>
              <p className="text-[10px] text-muted-foreground">Fail Rate</p>
            </div>
          </div>

          {question.tip && (
            <div className="bg-accent/10 rounded-lg p-3 text-xs text-accent-foreground">
              <span className="font-semibold">💡 Tip:</span> {question.tip}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDetailDialog;
