import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Send, MessageCircle, X } from "lucide-react";
import { markConversationRead } from "@/lib/chatReadReceipts";

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

interface DirectChatProps {
  otherUserId: string;
  otherUserName?: string;
  /** If true, renders inline (always open). Otherwise renders as a toggle button. */
  inline?: boolean;
}

const DirectChat = ({ otherUserId, otherUserName, inline = false }: DirectChatProps) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(inline);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(inline);

  useEffect(() => {
    if (!user || !otherUserId) return;

    const load = async () => {
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });
      setMessages((data as DirectMessage[]) || []);
      if (inline) markConversationRead(user.id, "direct", otherUserId);
    };
    load();

    // Only listen for messages sent TO me from the other user; my own sends update
    // local state immediately in handleSend, no realtime needed.
    const channel = supabase
      .channel(`dm-${[user.id, otherUserId].sort().join("-")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          const msg = payload.new as DirectMessage;
          if (msg.sender_id !== otherUserId) return;
          setMessages((prev) => [...prev, msg]);
          if (!wasOpen.current) setUnread((u) => u + 1);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, otherUserId]);

  useEffect(() => {
    wasOpen.current = open;
    if (open && user) {
      setUnread(0);
      markConversationRead(user.id, "direct", otherUserId);
    }
  }, [open, user, otherUserId]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    if (!newMsg.trim() || !user || sending) return;
    setSending(true);
    const text = newMsg.trim();
    setNewMsg("");
    const { data } = await supabase.from("direct_messages").insert({
      sender_id: user.id,
      receiver_id: otherUserId,
      message: text,
    } as any).select().single();
    if (data) setMessages((prev) => [...prev, data as DirectMessage]);
    setSending(false);
  };

  const headerTitle = otherUserName ? `Chat with ${otherUserName}` : "Direct Message";

  const messagesView = (
    <ScrollArea className="flex-1 px-3 py-2 min-h-0">
      {messages.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Start the conversation!</p>
      ) : (
        <div className="space-y-2">
          {messages.map((m) => {
            const isMine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="break-words">{m.message}</p>
                  <p className={`text-[10px] mt-0.5 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </ScrollArea>
  );

  const inputView = (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
      <Textarea
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a message..."
        className="text-sm min-h-[36px] max-h-24 resize-none"
        rows={1}
      />
      <Button size="icon" className="h-9 w-9 shrink-0" onClick={handleSend} disabled={!newMsg.trim() || sending}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );

  // Mobile: bottom drawer
  if (!inline && isMobile) {
    return (
      <>
        <Button variant="outline" size="sm" className="gap-1.5 relative" onClick={() => setOpen(true)}>
          <MessageCircle className="w-4 h-4" />
          Message
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="h-[85vh] flex flex-col p-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border mt-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <DrawerTitle className="text-sm font-semibold">{headerTitle}</DrawerTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {messagesView}
            {inputView}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop collapsed
  if (!open) {
    return (
      <Button variant="outline" size="sm" className="gap-1.5 relative" onClick={() => setOpen(true)}>
        <MessageCircle className="w-4 h-4" />
        Message
        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unread}
          </span>
        )}
      </Button>
    );
  }

  // Desktop / inline panel
  return (
    <div className="border border-border rounded-xl bg-card w-full max-w-md flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{headerTitle}</span>
        </div>
        {!inline && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="h-64 flex flex-col">{messagesView}</div>
      {inputView}
    </div>
  );
};

export default DirectChat;
