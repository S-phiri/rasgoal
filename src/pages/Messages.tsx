import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageCircle, Home } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import DirectChat from "@/components/DirectChat";
import { markConversationRead } from "@/lib/chatReadReceipts";

interface Contact {
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastAt: string | null;
  unread: number;
}

const Messages = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const homePath = role === "teacher" ? "/teacher" : "/";
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const activeId = params.get("with");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get all linked accepted partners (teacher or student)
    const { data: links } = await supabase
      .from("teacher_student_links")
      .select("teacher_id, student_id, status")
      .eq("status", "accepted")
      .or(`teacher_id.eq.${user.id},student_id.eq.${user.id}`);

    const partnerIds = Array.from(
      new Set(
        (links || []).map((l: any) =>
          l.teacher_id === user.id ? l.student_id : l.teacher_id
        )
      )
    );

    if (partnerIds.length === 0) {
      setContacts([]);
      setLoading(false);
      return;
    }

    // Profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, avatar_url")
      .in("user_id", partnerIds);

    // Read receipts
    const { data: receipts } = await supabase
      .from("chat_read_receipts")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id)
      .eq("conversation_type", "direct");
    const receiptMap = new Map<string, string>();
    (receipts || []).forEach((r: any) => receiptMap.set(r.conversation_id, r.last_read_at));

    // All messages between user and any partner
    const { data: msgs } = await supabase
      .from("direct_messages")
      .select("sender_id, receiver_id, message, created_at")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    const list: Contact[] = partnerIds.map((pid) => {
      const profile = (profiles || []).find((p: any) => p.user_id === pid);
      const convo = (msgs || []).filter(
        (m: any) =>
          (m.sender_id === pid && m.receiver_id === user.id) ||
          (m.sender_id === user.id && m.receiver_id === pid)
      );
      const last = convo[0];
      const lastRead = receiptMap.get(pid);
      const unread = convo.filter(
        (m: any) => m.sender_id === pid && (!lastRead || m.created_at > lastRead)
      ).length;

      return {
        userId: pid,
        fullName: profile?.full_name || null,
        avatarUrl: profile?.avatar_url || null,
        lastMessage: last?.message || null,
        lastAt: last?.created_at || null,
        unread,
      };
    });

    // Sort: unread first, then most recent
    list.sort((a, b) => {
      if ((b.unread > 0 ? 1 : 0) !== (a.unread > 0 ? 1 : 0)) {
        return (b.unread > 0 ? 1 : 0) - (a.unread > 0 ? 1 : 0);
      }
      return (b.lastAt || "").localeCompare(a.lastAt || "");
    });

    setContacts(list);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime: refresh when new direct messages arrive
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`messages-page-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages" },
        () => load()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_read_receipts", filter: `user_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, load]);

  const active = useMemo(
    () => contacts.find((c) => c.userId === activeId),
    [contacts, activeId]
  );

  const openConversation = async (contact: Contact) => {
    if (user) await markConversationRead(user.id, "direct", contact.userId);
    setParams({ with: contact.userId });
    load();
  };

  const closeConversation = () => {
    setParams({});
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (active ? closeConversation() : navigate(homePath))}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold font-display text-foreground flex-1">
            {active ? active.fullName || "Conversation" : "Messages"}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(homePath)}
            className="gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {active ? (
          <DirectChat
            otherUserId={active.userId}
            otherUserName={active.fullName || undefined}
            inline
          />
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : contacts.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No conversations yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Connect with a teacher or student to start chatting.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {contacts.map((c) => (
              <button
                key={c.userId}
                onClick={() => openConversation(c)}
                className="w-full text-left"
              >
                <Card className="p-4 flex items-center gap-3 hover:border-primary/50 transition-colors">
                  <Avatar className="w-10 h-10">
                    {c.avatarUrl && <AvatarImage src={c.avatarUrl} />}
                    <AvatarFallback>
                      {(c.fullName || "?").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground truncate">
                        {c.fullName || "User"}
                      </p>
                      {c.lastAt && (
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {new Date(c.lastAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full min-w-[22px] h-[22px] px-1.5 flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
