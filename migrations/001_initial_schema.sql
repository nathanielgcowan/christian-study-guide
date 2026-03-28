-- Create user-related tables (extending Supabase auth)

-- Extended user profile
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  subscription_tier TEXT DEFAULT 'free', -- free, premium, church
  tradition TEXT DEFAULT 'overview', -- overview, protestant, baptist, reformed, non-denominational
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Reading streaks
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_read_date DATE,
  total_studies INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own streaks"
  ON public.user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Study history (track what user reads)
CREATE TABLE IF NOT EXISTS public.user_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL, -- "John 3:16"
  translation TEXT DEFAULT 'web', -- web, kjv, asv
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  time_spent_minutes INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own studies"
  ON public.user_studies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create studies"
  ON public.user_studies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_studies_user_id ON public.user_studies(user_id);
CREATE INDEX idx_user_studies_read_at ON public.user_studies(read_at);

-- Notes and highlights
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL, -- "John 3:16"
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'note', -- note, highlight, question
  color TEXT DEFAULT '#ffff00', -- highlight color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes"
  ON public.user_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON public.user_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON public.user_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON public.user_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_notes_user_id ON public.user_notes(user_id);
CREATE INDEX idx_user_notes_reference ON public.user_notes(reference);

-- Note tags
CREATE TABLE IF NOT EXISTS public.note_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES public.user_notes(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tags on their notes"
  ON public.note_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_notes
      WHERE id = note_id AND user_id = auth.uid()
    )
  );

-- Bookmarks
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL, -- "John 3:16"
  category TEXT, -- optional category
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, reference)
);

ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON public.user_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.user_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.user_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Reading plans
CREATE TABLE IF NOT EXISTS public.reading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  plan_type TEXT DEFAULT 'general', -- general, theology, topical, customized
  duration_days INTEGER,
  entries JSONB, -- Array of {day: 1, reference: "Genesis 1", notes: "..."}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.reading_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reading plans"
  ON public.reading_plans FOR SELECT
  USING (true);

-- User reading plan progress
CREATE TABLE IF NOT EXISTS public.user_reading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.reading_plans(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_day INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, plan_id)
);

ALTER TABLE public.user_reading_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their reading plan progress"
  ON public.user_reading_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reading plan entries"
  ON public.user_reading_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reading plan progress"
  ON public.user_reading_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Journal entries
CREATE TABLE IF NOT EXISTS public.user_journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  entry_type TEXT DEFAULT 'journal', -- journal, prayer, devotional, reflection
  content TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journals"
  ON public.user_journals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create journal entries"
  ON public.user_journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journals"
  ON public.user_journals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals"
  ON public.user_journals FOR DELETE
  USING (auth.uid() = user_id);

-- AI Conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  type TEXT DEFAULT 'tutor', -- tutor, companion, guide
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON public.ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations"
  ON public.ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);

-- Study groups / Community
CREATE TABLE IF NOT EXISTS public.study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public groups"
  ON public.study_groups FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

-- Group members
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- member, moderator, admin
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view membership"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_id = group_members.group_id AND user_id = auth.uid()
    )
  );

-- Prayer board
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  answered BOOLEAN DEFAULT false,
  answered_at TIMESTAMP WITH TIME ZONE,
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public prayer requests"
  ON public.prayer_requests FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create prayer requests"
  ON public.prayer_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prayer requests"
  ON public.prayer_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Analytics (optional, for future features)
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- read_passage, created_note, completed_plan, etc.
  reference TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity"
  ON public.user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at);

-- Function to handle user profile creation
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, tradition)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'tradition', 'overview')
  );
  
  INSERT INTO public.user_streaks (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
