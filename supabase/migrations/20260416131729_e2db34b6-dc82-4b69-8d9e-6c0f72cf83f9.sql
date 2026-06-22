
-- Helper function to check if two users are linked as teacher-student
CREATE OR REPLACE FUNCTION public.are_teacher_student_linked(_user1 uuid, _user2 uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.teacher_student_links
    WHERE status = 'accepted'
      AND (
        (teacher_id = _user1 AND student_id = _user2)
        OR (teacher_id = _user2 AND student_id = _user1)
      )
  )
$$;

-- Direct messages table
CREATE TABLE public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own direct messages"
ON public.direct_messages FOR SELECT TO authenticated
USING (
  (auth.uid() = sender_id OR auth.uid() = receiver_id)
  AND are_teacher_student_linked(sender_id, receiver_id)
);

CREATE POLICY "Users can send direct messages to linked users"
ON public.direct_messages FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = sender_id
  AND are_teacher_student_linked(sender_id, receiver_id)
);

-- Index for fast lookups
CREATE INDEX idx_direct_messages_participants ON public.direct_messages (sender_id, receiver_id, created_at);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
