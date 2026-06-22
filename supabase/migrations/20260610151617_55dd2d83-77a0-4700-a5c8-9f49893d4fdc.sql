
-- Fix 1: Lock down is_assigned_to_test from direct RPC access.
REVOKE EXECUTE ON FUNCTION public.is_assigned_to_test(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_assigned_to_test(uuid, uuid) TO service_role;

-- Fix 2: Tighten realtime DM channel policy so only authorized DM topics are allowed.
DROP POLICY IF EXISTS "Users can subscribe to their own DM channels" ON realtime.messages;

CREATE POLICY "Users can subscribe to their own DM channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE 'dm-%'
  AND length(realtime.topic()) = 75
  AND (
    (auth.uid())::text = substring(realtime.topic() from 4 for 36)
    OR (auth.uid())::text = substring(realtime.topic() from 41 for 36)
  )
);
