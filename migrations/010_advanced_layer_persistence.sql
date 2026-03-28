-- Advanced layer persistence: passage dashboards, publishing, team access, mentor chat

CREATE TABLE IF NOT EXISTS public.user_passage_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  title TEXT NOT NULL,
  study_mode TEXT DEFAULT 'overview',
  summary TEXT NOT NULL,
  mentor_thread_summary TEXT,
  prayer_focus TEXT,
  next_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_passage_dashboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own passage dashboards" ON public.user_passage_dashboards;
CREATE POLICY "Users can view their own passage dashboards"
  ON public.user_passage_dashboards FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own passage dashboards" ON public.user_passage_dashboards;
CREATE POLICY "Users can create their own passage dashboards"
  ON public.user_passage_dashboards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own passage dashboards" ON public.user_passage_dashboards;
CREATE POLICY "Users can update their own passage dashboards"
  ON public.user_passage_dashboards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_passage_dashboards_user_id
  ON public.user_passage_dashboards(user_id);

CREATE INDEX IF NOT EXISTS idx_user_passage_dashboards_reference
  ON public.user_passage_dashboards(reference);

CREATE TABLE IF NOT EXISTS public.user_publishing_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audience TEXT DEFAULT 'small-group',
  content_type TEXT DEFAULT 'study',
  status TEXT DEFAULT 'draft',
  destination TEXT DEFAULT 'shared-studies',
  summary TEXT NOT NULL,
  share_scope TEXT DEFAULT 'team',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_publishing_flows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own publishing flows" ON public.user_publishing_flows;
CREATE POLICY "Users can view their own publishing flows"
  ON public.user_publishing_flows FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own publishing flows" ON public.user_publishing_flows;
CREATE POLICY "Users can create their own publishing flows"
  ON public.user_publishing_flows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own publishing flows" ON public.user_publishing_flows;
CREATE POLICY "Users can update their own publishing flows"
  ON public.user_publishing_flows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_publishing_flows_user_id
  ON public.user_publishing_flows(user_id);

CREATE TABLE IF NOT EXISTS public.user_team_access_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  team_name TEXT DEFAULT 'Ministry Team',
  default_role TEXT DEFAULT 'member',
  invite_mode TEXT DEFAULT 'email',
  approval_required BOOLEAN DEFAULT true,
  seat_limit INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_team_access_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own team access settings" ON public.user_team_access_settings;
CREATE POLICY "Users can view their own team access settings"
  ON public.user_team_access_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own team access settings" ON public.user_team_access_settings;
CREATE POLICY "Users can create their own team access settings"
  ON public.user_team_access_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own team access settings" ON public.user_team_access_settings;
CREATE POLICY "Users can update their own team access settings"
  ON public.user_team_access_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_team_access_settings_user_id
  ON public.user_team_access_settings(user_id);

CREATE TABLE IF NOT EXISTS public.user_team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  invite_email TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_team_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own team invites" ON public.user_team_invites;
CREATE POLICY "Users can view their own team invites"
  ON public.user_team_invites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own team invites" ON public.user_team_invites;
CREATE POLICY "Users can create their own team invites"
  ON public.user_team_invites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own team invites" ON public.user_team_invites;
CREATE POLICY "Users can update their own team invites"
  ON public.user_team_invites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_team_invites_user_id
  ON public.user_team_invites(user_id);

CREATE TABLE IF NOT EXISTS public.user_mentor_chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  title TEXT NOT NULL,
  goal TEXT,
  status TEXT DEFAULT 'active',
  latest_summary TEXT,
  next_step TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_mentor_chat_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own mentor chat threads" ON public.user_mentor_chat_threads;
CREATE POLICY "Users can view their own mentor chat threads"
  ON public.user_mentor_chat_threads FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own mentor chat threads" ON public.user_mentor_chat_threads;
CREATE POLICY "Users can create their own mentor chat threads"
  ON public.user_mentor_chat_threads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own mentor chat threads" ON public.user_mentor_chat_threads;
CREATE POLICY "Users can update their own mentor chat threads"
  ON public.user_mentor_chat_threads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_mentor_chat_threads_user_id
  ON public.user_mentor_chat_threads(user_id);

CREATE TABLE IF NOT EXISTS public.user_mentor_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.user_mentor_chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL,
  message TEXT NOT NULL,
  stage TEXT DEFAULT 'conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_mentor_chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own mentor chat messages" ON public.user_mentor_chat_messages;
CREATE POLICY "Users can view their own mentor chat messages"
  ON public.user_mentor_chat_messages FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own mentor chat messages" ON public.user_mentor_chat_messages;
CREATE POLICY "Users can create their own mentor chat messages"
  ON public.user_mentor_chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_mentor_chat_messages_user_id
  ON public.user_mentor_chat_messages(user_id);

CREATE INDEX IF NOT EXISTS idx_user_mentor_chat_messages_thread_id
  ON public.user_mentor_chat_messages(thread_id);
