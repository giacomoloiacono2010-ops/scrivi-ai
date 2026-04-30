-- =====================================================
-- SCRIVI AI - Schema Supabase Esteso
-- Esegui questo file su Supabase Dashboard → SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extend auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  piano TEXT NOT NULL DEFAULT 'free' CHECK (piano IN ('free', 'pro', 'team')),
  documenti_questo_mese INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  team_id UUID,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('email', 'preventivo', 'reclamo', 'contratto', 'report')),
  titolo TEXT,
  contenuto TEXT NOT NULL,
  campi_usati JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TEAMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TEAM MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ruolo TEXT DEFAULT 'member' CHECK (ruolo IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- =====================================================
-- TEAM INVITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.team_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  scade_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours',
  usato BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES public.profiles(id),
  referred_id UUID REFERENCES public.profiles(id),
  stato TEXT DEFAULT 'pending' CHECK (stato IN ('pending', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- PROFILES
CREATE POLICY "Utente vede solo il proprio profilo"
ON public.profiles FOR ALL
USING (auth.uid() = id);

-- DOCUMENTS
CREATE POLICY "Utente vede solo i propri documenti"
ON public.documents FOR ALL
USING (auth.uid() = user_id);

-- TEAMS
CREATE POLICY "Utente vede solo i propri team"
ON public.teams FOR ALL
USING (
  id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  OR owner_id = auth.uid()
);

-- TEAM MEMBERS
CREATE POLICY "Utente vede solo i propri team members"
ON public.team_members FOR ALL
USING (
  team_id IN (SELECT id FROM public.teams WHERE owner_id = auth.uid())
  OR user_id = auth.uid()
);

-- TEAM INVITES (solo owner può vedere)
CREATE POLICY "Owner vede inviti"
ON public.team_invites FOR ALL
USING (
  team_id IN (SELECT id FROM public.teams WHERE owner_id = auth.uid())
);

-- REFERRALS
CREATE POLICY "Utente vede solo i propri referral"
ON public.referrals FOR ALL
USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- =====================================================
-- TRIGGER: Crea profilo automaticamente al signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    upper(split_part(NEW.email, '@', 1)) || '-' || substring(gen_random_uuid()::text, 1, 4)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNZIONE: Reset mensile documenti
-- =====================================================
CREATE OR REPLACE FUNCTION public.reset_monthly_documents()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET documenti_questo_mese = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INDICI
-- =====================================================
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX idx_teams_owner_id ON public.teams(owner_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_team_invites_token ON public.team_invites(token);

-- =====================================================
-- NOTE: Per schedulare il reset mensile:
-- 1. Vai su Supabase Dashboard → Database → Cron Jobs
-- 2. Crea nuovo job: select public.reset_monthly_documents()
-- 3. Schedule: 0 0 1 * * (mezzanotte del primo giorno del mese)
-- =====================================================