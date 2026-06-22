import { supabase } from "@/integrations/supabase/client";

/**
 * Mark a conversation as read for the current user.
 * Uses upsert on the unique (user_id, conversation_type, conversation_id) constraint.
 */
export const markConversationRead = async (
  userId: string,
  conversationType: "direct" | "assignment",
  conversationId: string
) => {
  await supabase
    .from("chat_read_receipts")
    .upsert(
      {
        user_id: userId,
        conversation_type: conversationType,
        conversation_id: conversationId,
        last_read_at: new Date().toISOString(),
      } as any,
      { onConflict: "user_id,conversation_type,conversation_id" }
    );
};
