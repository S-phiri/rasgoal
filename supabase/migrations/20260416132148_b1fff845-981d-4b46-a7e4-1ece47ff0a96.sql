
CREATE TABLE public.chat_read_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  conversation_type text NOT NULL, -- 'direct' or 'assignment'
  conversation_id text NOT NULL,   -- other_user_id for direct, assignment_id for assignment
  last_read_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, conversation_type, conversation_id)
);

ALTER TABLE public.chat_read_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own read receipts"
ON public.chat_read_receipts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own read receipts"
ON public.chat_read_receipts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own read receipts"
ON public.chat_read_receipts FOR UPDATE TO authenticated
USING (auth.uid() = user_id);
