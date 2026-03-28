-- Platform layer persistence: journeys, church admin, room sync

CREATE TABLE IF NOT EXISTS public.user_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_label TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  summary TEXT NOT NULL,
  current_step TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own journeys" ON public.user_journeys;
CREATE POLICY "Users can view their own journeys"
  ON public.user_journeys FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own journeys" ON public.user_journeys;
CREATE POLICY "Users can create their own journeys"
  ON public.user_journeys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own journeys" ON public.user_journeys;
CREATE POLICY "Users can update their own journeys"
  ON public.user_journeys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_journeys_user_id
  ON public.user_journeys(user_id);

CREATE INDEX IF NOT EXISTS idx_user_journeys_created_at
  ON public.user_journeys(created_at);

CREATE TABLE IF NOT EXISTS public.user_church_admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ministry_name TEXT DEFAULT 'Church Team',
  role_scope TEXT DEFAULT 'ministry-lead',
  approvals_enabled BOOLEAN DEFAULT true,
  room_oversight_enabled BOOLEAN DEFAULT true,
  publishing_queue_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_church_admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own church admin settings" ON public.user_church_admin_settings;
CREATE POLICY "Users can view their own church admin settings"
  ON public.user_church_admin_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own church admin settings" ON public.user_church_admin_settings;
CREATE POLICY "Users can create their own church admin settings"
  ON public.user_church_admin_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own church admin settings" ON public.user_church_admin_settings;
CREATE POLICY "Users can update their own church admin settings"
  ON public.user_church_admin_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_church_admin_settings_user_id
  ON public.user_church_admin_settings(user_id);

CREATE TABLE IF NOT EXISTS public.user_room_sync_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  room_type TEXT DEFAULT 'shared-study-room',
  sync_stage TEXT DEFAULT 'welcome',
  participant_count INTEGER DEFAULT 1,
  presence_mode TEXT DEFAULT 'leader-led',
  shared_notes_enabled BOOLEAN DEFAULT true,
  prayer_feed_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_room_sync_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own room sync states" ON public.user_room_sync_states;
CREATE POLICY "Users can view their own room sync states"
  ON public.user_room_sync_states FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own room sync states" ON public.user_room_sync_states;
CREATE POLICY "Users can create their own room sync states"
  ON public.user_room_sync_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own room sync states" ON public.user_room_sync_states;
CREATE POLICY "Users can update their own room sync states"
  ON public.user_room_sync_states FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_room_sync_states_user_id
  ON public.user_room_sync_states(user_id);

CREATE INDEX IF NOT EXISTS idx_user_room_sync_states_created_at
  ON public.user_room_sync_states(created_at);
