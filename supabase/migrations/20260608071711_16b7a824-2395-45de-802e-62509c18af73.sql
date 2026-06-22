
-- Enable RLS on realtime.messages and restrict direct_messages channel topics
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can subscribe to their own DM channels" ON realtime.messages;

CREATE POLICY "Users can subscribe to their own DM channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Allow channels that are not direct-message topics (other features unaffected)
  (realtime.topic() IS NULL)
  OR (realtime.topic() NOT LIKE 'dm-%')
  OR (
    -- For dm-<uuid>-<uuid> topics, require auth.uid() to be one of the two ids
    realtime.topic() LIKE 'dm-%-%'
    AND position(auth.uid()::text in realtime.topic()) > 0
  )
);
