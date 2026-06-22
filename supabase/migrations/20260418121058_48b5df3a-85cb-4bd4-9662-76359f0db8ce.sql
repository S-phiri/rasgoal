DROP TABLE IF EXISTS public.assignment_messages CASCADE;

-- Clean up read receipts for assignment conversations (no longer used)
DELETE FROM public.chat_read_receipts WHERE conversation_type = 'assignment';