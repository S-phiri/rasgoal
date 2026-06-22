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