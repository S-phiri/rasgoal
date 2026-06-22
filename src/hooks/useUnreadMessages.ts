import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns total unread direct message count.
 * Uses chat_read_receipts to track what has been read.
 * Optimized: uses count queries per sender instead of fetching all messages.
 */
export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!user) { setCount(0); return; }

    // 1. Get read receipts (small)
    const { data: receipts } = await supabase
      .from("chat_read_receipts")
      .select("conversation_id, last_read_at")
      .eq("user_id", user.id)
      .eq("conversation_type", "direct");

    const receiptMap = new Map<string, string>();
    (receipts || []).forEach((r: any) => receiptMap.set(r.conversation_id, r.last_read_at));

    // 2. Get distinct senders who messaged this user (just sender_id + latest created_at)
    const { data: senders } = await supabase
      .from("direct_messages")
      .select("sender_id, created_at")
      .eq("receiver_id", user.id)
      .order("created_at", { ascending: false })
      .limit(500);

    if (!senders || senders.length === 0) { setCount(0); return; }

    const uniqueSenders = [...new Set(senders.map((s: any) => s.sender_id))];

    // 3. For each sender, count messages newer than last_read_at using HEAD count
    let total = 0;
    await Promise.all(uniqueSenders.map(async (sid) => {
      const lastRead = receiptMap.get(sid);
      let q = supabase
        .from("direct_messages")
        .select("id", { count: "exact", head: true })
        .eq("sender_id", sid)
        .eq("receiver_id", user.id);
      if (lastRead) q = q.gt("created_at", lastRead);
      const { count: c } = await q;
      total += c || 0;
    }));

    setCount(total);
  }, [user]);

  useEffect(() => {
    if (!user) { setCount(0); return; }

    fetchCount();

    const channel = supabase
      .channel(`unread-msgs-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => setCount((c) => c + 1)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_read_receipts", filter: `user_id=eq.${user.id}` },
        () => { fetchCount(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchCount]);

  return { count, refetch: fetchCount };
};
