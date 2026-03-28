-- Learning-layer persistence: theology, Bible questions, custom plans, memorization, maps

CREATE TABLE IF NOT EXISTS public.user_theology_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  focus TEXT NOT NULL,
  key_verse TEXT,
  tradition_view TEXT,
  status TEXT DEFAULT 'saved',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_theology_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own theology topics" ON public.user_theology_topics;
CREATE POLICY "Users can view their own theology topics"
  ON public.user_theology_topics FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own theology topics" ON public.user_theology_topics;
CREATE POLICY "Users can create their own theology topics"
  ON public.user_theology_topics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_theology_topics_user_id
  ON public.user_theology_topics(user_id);

CREATE TABLE IF NOT EXISTS public.user_bible_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer_summary TEXT NOT NULL,
  selected_topic TEXT,
  key_verses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_bible_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bible questions" ON public.user_bible_questions;
CREATE POLICY "Users can view their own bible questions"
  ON public.user_bible_questions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own bible questions" ON public.user_bible_questions;
CREATE POLICY "Users can create their own bible questions"
  ON public.user_bible_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_bible_questions_user_id
  ON public.user_bible_questions(user_id);

CREATE TABLE IF NOT EXISTS public.user_custom_reading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_days INTEGER DEFAULT 14,
  focus TEXT,
  summary TEXT NOT NULL,
  entries JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_custom_reading_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own custom reading plans" ON public.user_custom_reading_plans;
CREATE POLICY "Users can view their own custom reading plans"
  ON public.user_custom_reading_plans FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own custom reading plans" ON public.user_custom_reading_plans;
CREATE POLICY "Users can create their own custom reading plans"
  ON public.user_custom_reading_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_custom_reading_plans_user_id
  ON public.user_custom_reading_plans(user_id);

CREATE TABLE IF NOT EXISTS public.user_memorization_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  prompt TEXT NOT NULL,
  review_count INTEGER DEFAULT 0,
  mastery_level TEXT DEFAULT 'starting',
  last_result TEXT DEFAULT 'reviewed',
  next_review_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, reference)
);

ALTER TABLE public.user_memorization_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own memorization progress" ON public.user_memorization_progress;
CREATE POLICY "Users can view their own memorization progress"
  ON public.user_memorization_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own memorization progress" ON public.user_memorization_progress;
CREATE POLICY "Users can create their own memorization progress"
  ON public.user_memorization_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own memorization progress" ON public.user_memorization_progress;
CREATE POLICY "Users can update their own memorization progress"
  ON public.user_memorization_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_memorization_progress_user_id
  ON public.user_memorization_progress(user_id);

CREATE TABLE IF NOT EXISTS public.user_bible_map_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  map_title TEXT NOT NULL,
  selected_place TEXT NOT NULL,
  layer_mode TEXT DEFAULT 'overview',
  timeline_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_bible_map_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bible map states" ON public.user_bible_map_states;
CREATE POLICY "Users can view their own bible map states"
  ON public.user_bible_map_states FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own bible map states" ON public.user_bible_map_states;
CREATE POLICY "Users can create their own bible map states"
  ON public.user_bible_map_states FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_bible_map_states_user_id
  ON public.user_bible_map_states(user_id);
