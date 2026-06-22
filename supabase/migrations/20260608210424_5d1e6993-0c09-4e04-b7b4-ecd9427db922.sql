
-- 1. Tighten realtime DM channel policy: require auth.uid() to exactly match
-- one of the two UUIDs in "dm-<uuid1>-<uuid2>" (sorted), not just be a substring.
DROP POLICY IF EXISTS "Users can subscribe to their own DM channels" ON realtime.messages;

CREATE POLICY "Users can subscribe to their own DM channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (realtime.topic() IS NULL)
  OR (realtime.topic() NOT LIKE 'dm-%')
  OR (
    -- Topic format: dm-<uuid 36 chars>-<uuid 36 chars> => total length 75
    length(realtime.topic()) = 75
    AND (
      auth.uid()::text = substring(realtime.topic() from 4 for 36)
      OR auth.uid()::text = substring(realtime.topic() from 41 for 36)
    )
  )
);

-- 2. question_attempts: restrict UPDATE and DELETE to owner
CREATE POLICY "Users can update own attempts"
ON public.question_attempts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own attempts"
ON public.question_attempts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. user_rewards: restrict INSERT/UPDATE/DELETE to owner
CREATE POLICY "Users can insert own rewards"
ON public.user_rewards
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rewards"
ON public.user_rewards
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own rewards"
ON public.user_rewards
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
