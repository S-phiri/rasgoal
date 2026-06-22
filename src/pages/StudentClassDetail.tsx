import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Video, ExternalLink, FileText, Link as LinkIcon, Loader2 } from "lucide-react";
import { useLiveClass } from "@/hooks/useLiveClasses";
import { useNow } from "@/hooks/useNow";
import { canJoinClass, formatClassTime, getClassWindow } from "@/lib/classTime";

const StudentClassDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { liveClass, resources, loading } = useLiveClass(id);
  const now = useNow();

  if (loading || !liveClass) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const joinable = canJoinClass(liveClass, now);
  const { joinOpensAt, end } = getClassWindow(liveClass);
  const isPast = now > end;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/classes")} className="gap-1">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-display font-bold text-foreground truncate">{liveClass.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-card rounded-xl border border-border p-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {liveClass.status === "cancelled" && <Badge variant="destructive" className="text-[10px]">Cancelled</Badge>}
            {joinable && <Badge className="bg-success text-success-foreground text-[10px]">Live now</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{formatClassTime(liveClass)}</p>
          {(liveClass.subject || liveClass.grade || liveClass.topic) && (
            <p className="text-sm text-muted-foreground">
              {[liveClass.subject, liveClass.grade && `Grade ${liveClass.grade}`, liveClass.topic].filter(Boolean).join(" · ")}
            </p>
          )}
          {liveClass.description && <p className="text-sm text-foreground mt-2">{liveClass.description}</p>}

          <div className="pt-3">
            <Button
              size="lg"
              onClick={() => window.open(`/classes/${liveClass.id}/room`, "_blank", "noopener,noreferrer")}
              disabled={!joinable}
              className="gap-2 w-full sm:w-auto"
            >
              <Video className="w-5 h-5" />
              Join class
            </Button>
            {!joinable && liveClass.status !== "cancelled" && !isPast && (
              <p className="text-xs text-muted-foreground mt-2">
                Join opens at {joinOpensAt.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" })}.
              </p>
            )}
            {isPast && liveClass.status !== "cancelled" && (
              <p className="text-xs text-muted-foreground mt-2">This class has ended.</p>
            )}
          </div>
        </div>

        {liveClass.recording_url && (
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-display font-bold mb-2">Recording</h2>
            <a href={liveClass.recording_url} target="_blank" rel="noopener noreferrer"
              className="text-sm text-primary underline break-all flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />{liveClass.recording_url}
            </a>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-display font-bold mb-3">Resources</h2>
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources shared yet.</p>
          ) : (
            <div className="space-y-2">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {r.type === "link" && <LinkIcon className="w-4 h-4 text-primary shrink-0" />}
                    {r.type === "file" && <FileText className="w-4 h-4 text-primary shrink-0" />}
                    {(r.type === "note" || r.type === "homework") && <FileText className="w-4 h-4 text-accent shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{r.type}</p>
                      {r.content && <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{r.content}</p>}
                    </div>
                  </div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="w-4 h-4" /></Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentClassDetail;
