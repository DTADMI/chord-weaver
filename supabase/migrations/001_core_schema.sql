-- ============================================
-- Migration 001: Chord Weaver core schema (Phase 1)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_chords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  source_type TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual','audio','import')),
  chord_data JSONB NOT NULL DEFAULT '[]'::JSONB,
  chord_pro_text TEXT,
  abc_notation TEXT,
  audio_url TEXT,
  duration_seconds NUMERIC(6,1),
  bpm INTEGER,
  key TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}'::TEXT[]
);

CREATE INDEX IF NOT EXISTS saved_chords_user_id_idx ON public.saved_chords(user_id);
CREATE INDEX IF NOT EXISTS saved_chords_created_at_idx ON public.saved_chords(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_chords_is_public_idx ON public.saved_chords(is_public) WHERE is_public = true;

ALTER TABLE public.saved_chords ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own chords" ON public.saved_chords;
CREATE POLICY "Users can view own chords"
  ON public.saved_chords FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_public = true);

DROP POLICY IF EXISTS "Users can insert chords" ON public.saved_chords;
CREATE POLICY "Users can insert chords"
  ON public.saved_chords FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own chords" ON public.saved_chords;
CREATE POLICY "Users can update own chords"
  ON public.saved_chords FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own chords" ON public.saved_chords;
CREATE POLICY "Users can delete own chords"
  ON public.saved_chords FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Public users can view public chords (anon read)
DROP POLICY IF EXISTS "Anyone can view public chords" ON public.saved_chords;
CREATE POLICY "Anyone can view public chords"
  ON public.saved_chords FOR SELECT
  TO anon
  USING (is_public = true);

-- Data API grants
GRANT SELECT ON TABLE public.saved_chords TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.saved_chords TO authenticated;

-- User preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  default_key TEXT DEFAULT 'C',
  default_bpm INTEGER DEFAULT 120,
  preferred_notation TEXT DEFAULT 'vexflow' CHECK (preferred_notation IN ('vexflow','chordpro','abc','text')),
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark','light','system')),
  soundfont TEXT DEFAULT 'piano',
  metronome_enabled BOOLEAN DEFAULT false,
  preferences JSONB DEFAULT '{}'::JSONB
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

GRANT SELECT, INSERT, UPDATE ON TABLE public.user_preferences TO authenticated;
