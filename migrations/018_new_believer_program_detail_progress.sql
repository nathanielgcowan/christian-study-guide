-- New believer discipleship program detail tracking

ALTER TABLE public.user_new_believer_progress
ADD COLUMN IF NOT EXISTS week_checklists JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.user_new_believer_progress
ADD COLUMN IF NOT EXISTS daily_readings_completed JSONB DEFAULT '{}'::jsonb;
