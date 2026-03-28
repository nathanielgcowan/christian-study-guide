-- Command center preferences persistence

CREATE TABLE IF NOT EXISTS public.user_command_center_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  visible_widgets JSONB DEFAULT '{}'::jsonb,
  focus_goal TEXT DEFAULT 'consistency',
  recommendation_weights JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_command_center_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own command center preferences" ON public.user_command_center_preferences;
CREATE POLICY "Users can view their own command center preferences"
  ON public.user_command_center_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own command center preferences" ON public.user_command_center_preferences;
CREATE POLICY "Users can create their own command center preferences"
  ON public.user_command_center_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own command center preferences" ON public.user_command_center_preferences;
CREATE POLICY "Users can update their own command center preferences"
  ON public.user_command_center_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_command_center_preferences_user_id
  ON public.user_command_center_preferences(user_id);
