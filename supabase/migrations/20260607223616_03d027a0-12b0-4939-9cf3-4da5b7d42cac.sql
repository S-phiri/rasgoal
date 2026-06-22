CREATE OR REPLACE FUNCTION public.is_valid_internal_secret(_secret_name text, _secret_value text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM vault.decrypted_secrets
    WHERE name = _secret_name
      AND decrypted_secret = _secret_value
  )
$$;

REVOKE ALL ON FUNCTION public.is_valid_internal_secret(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_valid_internal_secret(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.is_valid_internal_secret(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.is_valid_internal_secret(text, text) TO service_role;

SELECT cron.unschedule('reconcile-dpo-payments')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'reconcile-dpo-payments'
);

SELECT cron.schedule(
  'reconcile-dpo-payments',
  '*/5 * * * *',
  $$
    WITH service_key AS (
      SELECT decrypted_secret AS token
      FROM vault.decrypted_secrets
      WHERE name = 'email_queue_service_role_key'
      LIMIT 1
    )
    SELECT net.http_post(
      url := 'https://yjgbocwxumxurvzaidmd.supabase.co/functions/v1/reconcile-dpo-payments',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_key.token
      ),
      body := '{}'::jsonb
    )
    FROM service_key
    WHERE service_key.token IS NOT NULL
      AND service_key.token <> '';
  $$
);

WITH service_key AS (
  SELECT decrypted_secret AS token
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1
)
SELECT net.http_post(
  url := 'https://yjgbocwxumxurvzaidmd.supabase.co/functions/v1/reconcile-dpo-payments',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer ' || service_key.token
  ),
  body := '{}'::jsonb
)
FROM service_key
WHERE service_key.token IS NOT NULL
  AND service_key.token <> '';