-- Experience layer persistence: dashboard, AI studio, translations, commentaries

CREATE TABLE IF NOT EXISTS public.user_dashboard_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  reading TEXT NOT NULL,
  summary TEXT NOT NULL,
  focus_mode TEXT DEFAULT 'daily-discipleship',
  reminder_state TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_dashboard_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own dashboard states" ON public.user_dashboard_states;
CREATE POLICY "Users can view their own dashboard states"
  ON public.user_dashboard_states FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own dashboard states" ON public.user_dashboard_states;
CREATE POLICY "Users can create their own dashboard states"
  ON public.user_dashboard_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_dashboard_states_user_id
  ON public.user_dashboard_states(user_id);

CREATE INDEX IF NOT EXISTS idx_user_dashboard_states_created_at
  ON public.user_dashboard_states(created_at);

CREATE TABLE IF NOT EXISTS public.user_ai_studio_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  generation_type TEXT NOT NULL,
  source_reference TEXT,
  summary TEXT NOT NULL,
  prompt_template TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_ai_studio_outputs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own ai studio outputs" ON public.user_ai_studio_outputs;
CREATE POLICY "Users can view their own ai studio outputs"
  ON public.user_ai_studio_outputs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own ai studio outputs" ON public.user_ai_studio_outputs;
CREATE POLICY "Users can create their own ai studio outputs"
  ON public.user_ai_studio_outputs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_ai_studio_outputs_user_id
  ON public.user_ai_studio_outputs(user_id);

CREATE INDEX IF NOT EXISTS idx_user_ai_studio_outputs_created_at
  ON public.user_ai_studio_outputs(created_at);

CREATE TABLE IF NOT EXISTS public.user_translation_compare_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  primary_translation TEXT DEFAULT 'ESV',
  secondary_translation TEXT DEFAULT 'NIV',
  tertiary_translation TEXT DEFAULT 'KJV',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_translation_compare_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own translation compare states" ON public.user_translation_compare_states;
CREATE POLICY "Users can view their own translation compare states"
  ON public.user_translation_compare_states FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own translation compare states" ON public.user_translation_compare_states;
CREATE POLICY "Users can create their own translation compare states"
  ON public.user_translation_compare_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_translation_compare_states_user_id
  ON public.user_translation_compare_states(user_id);

CREATE INDEX IF NOT EXISTS idx_user_translation_compare_states_created_at
  ON public.user_translation_compare_states(created_at);

CREATE TABLE IF NOT EXISTS public.user_commentary_saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  source_title TEXT NOT NULL,
  reference TEXT NOT NULL,
  summary TEXT NOT NULL,
  use_case TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_commentary_saves ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own commentary saves" ON public.user_commentary_saves;
CREATE POLICY "Users can view their own commentary saves"
  ON public.user_commentary_saves FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own commentary saves" ON public.user_commentary_saves;
CREATE POLICY "Users can create their own commentary saves"
  ON public.user_commentary_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_commentary_saves_user_id
  ON public.user_commentary_saves(user_id);

CREATE INDEX IF NOT EXISTS idx_user_commentary_saves_created_at
  ON public.user_commentary_saves(created_at);
