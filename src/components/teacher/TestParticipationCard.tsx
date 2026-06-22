import { useState } from "react";
import { ChevronDown, ChevronUp, Users, UserCheck, UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { StudentProfile } from "@/hooks/useTeacherAnalytics";

interface Props {
  testNumber: number;
  questionCount: number;
  takenStudents: StudentProfile[];
  notTakenStudents: StudentProfile[];
  avgScore: number;
}

const TestParticipationCard = ({ testNumber, questionCount, takenStudents, notTakenStudents, avgScore }: Props) => {
  const [open, setOpen] = useState(false);
  const total = takenStudents.length + notTakenStudents.length;
  const takenPct = total > 0 ? Math.round((takenStudents.length / total) * 100) : 0;

  if (questionCount === 0) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
              {testNumber}
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm text-foreground">Test #{testNumber}</p>
              <p className="text-xs text-muted-foreground">{questionCount} questions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-success">
                <UserCheck className="w-3.5 h-3.5" />
                {takenStudents.length} taken
              </span>
              <span className="flex items-center gap-1 text-destructive">
                <UserX className="w-3.5 h-3.5" />
                {notTakenStudents.length} not taken
              </span>
              {takenStudents.length > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  Avg: {avgScore}%
                </Badge>
              )}
            </div>
            {/* Progress bar */}
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full transition-all" style={{ width: `${takenPct}%` }} />
            </div>
            {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Taken */}
            <div>
              <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> Taken ({takenStudents.length})
              </p>
              {takenStudents.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No students yet</p>
              ) : (
                <div className="space-y-1">
                  {takenStudents.map((s) => (
                    <div key={s.user_id} className="text-xs text-foreground bg-success/5 rounded px-2 py-1">
                      {s.full_name || "Unnamed Student"}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Not taken */}
            <div>
              <p className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1">
                <UserX className="w-3.5 h-3.5" /> Not Taken ({notTakenStudents.length})
              </p>
              {notTakenStudents.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">All students completed!</p>
              ) : (
                <div className="space-y-1">
                  {notTakenStudents.map((s) => (
                    <div key={s.user_id} className="text-xs text-foreground bg-destructive/5 rounded px-2 py-1">
                      {s.full_name || "Unnamed Student"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default TestParticipationCard;
