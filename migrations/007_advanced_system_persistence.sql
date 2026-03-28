-- Advanced systems persistence: collaboration, personalization, orchestration

CREATE TABLE IF NOT EXISTS public.user_collaboration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  preferred_room_type TEXT DEFAULT 'shared-study-room',
  moderation_mode TEXT DEFAULT 'guided',
  live_presence_enabled BOOLEAN DEFAULT true,
  shared_library_enabled BOOLEAN DEFAULT true,
  church_team_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_collaboration_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own collaboration settings" ON public.user_collaboration_settings;
CREATE POLICY "Users can view their own collaboration settings"
  ON public.user_collaboration_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own collaboration settings" ON public.user_collaboration_settings;
CREATE POLICY "Users can create their own collaboration settings"
  ON public.user_collaboration_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own collaboration settings" ON public.user_collaboration_settings;
CREATE POLICY "Users can update their own collaboration settings"
  ON public.user_collaboration_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_collaboration_settings_user_id
  ON public.user_collaboration_settings(user_id);

CREATE TABLE IF NOT EXISTS public.user_personalization_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  favorite_themes JSONB DEFAULT '[]'::jsonb,
  active_struggles JSONB DEFAULT '[]'::jsonb,
  growth_goals JSONB DEFAULT '[]'::jsonb,
  preferred_tone TEXT DEFAULT 'encouraging',
  recommendation_profile JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_personalization_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own personalization preferences" ON public.user_personalization_preferences;
CREATE POLICY "Users can view their own personalization preferences"
  ON public.user_personalization_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own personalization preferences" ON public.user_personalization_preferences;
CREATE POLICY "Users can create their own personalization preferences"
  ON public.user_personalization_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own personalization preferences" ON public.user_personalization_preferences;
CREATE POLICY "Users can update their own personalization preferences"
  ON public.user_personalization_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_personalization_preferences_user_id
  ON public.user_personalization_preferences(user_id);

CREATE TABLE IF NOT EXISTS public.user_workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  linked_reference TEXT,
  stage TEXT DEFAULT 'planned',
  status TEXT DEFAULT 'active',
  summary TEXT NOT NULL,
  next_step TEXT,
  output JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_workflow_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own workflow runs" ON public.user_workflow_runs;
CREATE POLICY "Users can view their own workflow runs"
  ON public.user_workflow_runs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own workflow runs" ON public.user_workflow_runs;
CREATE POLICY "Users can create their own workflow runs"
  ON public.user_workflow_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own workflow runs" ON public.user_workflow_runs;
CREATE POLICY "Users can update their own workflow runs"
  ON public.user_workflow_runs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_workflow_runs_user_id
  ON public.user_workflow_runs(user_id);

CREATE INDEX IF NOT EXISTS idx_user_workflow_runs_created_at
  ON public.user_workflow_runs(created_at);
