import { supabase } from "@/integrations/supabase/client";

interface ClassInviteParams {
  classId: string;
  classTitle: string;
  subject?: string | null;
  topic?: string | null;
  description?: string | null;
  classType: "one_to_one" | "group";
  startTimeISO: string;
  durationMinutes: number;
  teacherName: string;
  recipients: { studentId: string; email: string; name?: string | null }[];
}

const formatWhen = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  } catch { return iso; }
};

export const sendClassInvitationEmails = async (p: ClassInviteParams) => {
  const classUrl = `${window.location.origin}/classes/${p.classId}`;
  const startTimeFormatted = formatWhen(p.startTimeISO);

  await Promise.all(
    p.recipients
      .filter((r) => !!r.email)
      .map((r) =>
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "class-invitation",
            recipientEmail: r.email,
            idempotencyKey: `class-invite-${p.classId}-${r.studentId}`,
            templateData: {
              studentName: r.name || undefined,
              teacherName: p.teacherName,
              classTitle: p.classTitle,
              subject: p.subject || undefined,
              topic: p.topic || undefined,
              classType: p.classType,
              startTimeFormatted,
              durationMinutes: p.durationMinutes,
              description: p.description || undefined,
              classUrl,
            },
          },
        }).catch((e) => console.warn("Failed to send class invite email", e))
      )
  );
};
