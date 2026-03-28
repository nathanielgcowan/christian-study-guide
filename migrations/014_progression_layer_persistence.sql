-- Progression persistence: gamification, certificates, verse-by-verse study

CREATE TABLE IF NOT EXISTS public.user_gamification_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  xp_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  unlocked_badges JSONB DEFAULT '[]'::jsonb,
  completed_daily_quests JSONB DEFAULT '[]'::jsonb,
  active_weekly_challenges JSONB DEFAULT '[]'::jsonb,
  mastery_rank TEXT DEFAULT 'Learning',
  streak_freezes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_gamification_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own gamification progress" ON public.user_gamification_progress;
CREATE POLICY "Users can view their own gamification progress"
  ON public.user_gamification_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own gamification progress" ON public.user_gamification_progress;
CREATE POLICY "Users can create their own gamification progress"
  ON public.user_gamification_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own gamification progress" ON public.user_gamification_progress;
CREATE POLICY "Users can update their own gamification progress"
  ON public.user_gamification_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_gamification_progress_user_id
  ON public.user_gamification_progress(user_id);

CREATE TABLE IF NOT EXISTS public.user_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reward TEXT NOT NULL,
  status TEXT DEFAULT 'earned',
  share_card_state TEXT DEFAULT 'private',
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own certificates" ON public.user_certificates;
CREATE POLICY "Users can view their own certificates"
  ON public.user_certificates FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own certificates" ON public.user_certificates;
CREATE POLICY "Users can create their own certificates"
  ON public.user_certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own certificates" ON public.user_certificates;
CREATE POLICY "Users can update their own certificates"
  ON public.user_certificates FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own certificates" ON public.user_certificates;
CREATE POLICY "Users can delete their own certificates"
  ON public.user_certificates FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id
  ON public.user_certificates(user_id);

CREATE INDEX IF NOT EXISTS idx_user_certificates_issued_at
  ON public.user_certificates(issued_at);

CREATE TABLE IF NOT EXISTS public.user_verse_by_verse_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  completed_verses JSONB DEFAULT '[]'::jsonb,
  last_focus_verse TEXT,
  completion_status TEXT DEFAULT 'in-progress',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, reference)
);

ALTER TABLE public.user_verse_by_verse_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own verse progress" ON public.user_verse_by_verse_progress;
CREATE POLICY "Users can view their own verse progress"
  ON public.user_verse_by_verse_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own verse progress" ON public.user_verse_by_verse_progress;
CREATE POLICY "Users can create their own verse progress"
  ON public.user_verse_by_verse_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own verse progress" ON public.user_verse_by_verse_progress;
CREATE POLICY "Users can update their own verse progress"
  ON public.user_verse_by_verse_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_verse_by_verse_progress_user_id
  ON public.user_verse_by_verse_progress(user_id);

