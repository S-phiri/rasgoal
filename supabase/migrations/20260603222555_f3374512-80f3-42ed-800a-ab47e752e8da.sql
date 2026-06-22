
-- Subscriptions: remove client INSERT/UPDATE (service_role bypasses RLS)
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;

-- User rewards: remove client INSERT
DROP POLICY IF EXISTS "Users can insert own rewards" ON public.user_rewards;

-- Live classes: stop realtime broadcast of row data (including recording_url)
ALTER PUBLICATION supabase_realtime DROP TABLE public.live_classes;
