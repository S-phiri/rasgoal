import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, Mail, Calendar } from "lucide-react";
import type { LinkedStudent } from "@/hooks/useTeacherStudents";

interface Props {
  requests: LinkedStudent[];
  onAccept: (linkId: string) => void;
  onDecline: (linkId: string) => void;
}

const TeacherRequestsList = ({ requests, onAccept, onDecline }: Props) => {
  if (requests.length === 0) return null;

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-secondary" />
        <h3 className="font-display font-bold text-sm text-foreground">
          Pending Requests ({requests.length})
        </h3>
      </div>
      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.linkId} className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Avatar className="w-10 h-10 mt-0.5">
                  {req.profile?.avatar_url && <AvatarImage src={req.profile.avatar_url} />}
                  <AvatarFallback className="text-sm bg-primary/10 text-primary font-bold">
                    {req.profile?.full_name?.[0]?.toUpperCase() || "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {req.profile?.full_name || "Unknown Student"}
                  </p>
                  {req.studentEmail && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground truncate">{req.studentEmail}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {req.profile?.grade && (
                      <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        Grade {req.profile.grade}
                      </span>
                    )}
                    {req.profile?.school && (
                      <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                        {req.profile.school}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(req.linkedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" onClick={() => onDecline(req.linkId)} className="h-8 w-8 p-0" title="Decline">
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => onAccept(req.linkId)} className="h-8 gap-1">
                  <Check className="w-3 h-3" /> Accept
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherRequestsList;
