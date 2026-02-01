-- ========================================
-- TAMIZHCINEUNION CMS - Full Database Schema
-- ========================================

-- 1. Create ENUMS
CREATE TYPE public.project_type AS ENUM ('film', 'theatre', 'music', 'visual', 'documentary');
CREATE TYPE public.project_status AS ENUM ('ongoing', 'completed', 'upcoming');
CREATE TYPE public.media_type AS ENUM ('video', 'photo', 'audio', 'document');
CREATE TYPE public.app_role AS ENUM ('admin');

-- 2. USER ROLES TABLE (for admin access)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 3. ARTIST CATEGORIES TABLE
CREATE TABLE public.artist_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.artist_categories ENABLE ROW LEVEL SECURITY;

-- 4. ARTISTS TABLE
CREATE TABLE public.artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    photo TEXT,
    cover_image TEXT,
    category_id UUID REFERENCES public.artist_categories(id) ON DELETE SET NULL,
    location TEXT,
    bio TEXT,
    skills TEXT[],
    social_facebook TEXT,
    social_instagram TEXT,
    social_youtube TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

-- 5. PROJECTS TABLE
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type project_type NOT NULL DEFAULT 'film',
    status project_status NOT NULL DEFAULT 'upcoming',
    thumbnail TEXT,
    banner_image TEXT,
    description TEXT,
    synopsis TEXT,
    release_date DATE,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 6. PROJECT CREDITS (linking artists to projects)
CREATE TABLE public.project_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (project_id, artist_id, role)
);

ALTER TABLE public.project_credits ENABLE ROW LEVEL SECURITY;

-- 7. MEDIA CATEGORIES TABLE
CREATE TABLE public.media_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type media_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;

-- 8. MEDIA ITEMS TABLE
CREATE TABLE public.media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type media_type NOT NULL DEFAULT 'video',
    category_id UUID REFERENCES public.media_categories(id) ON DELETE SET NULL,
    thumbnail TEXT,
    url TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- 9. BLOG POSTS TABLE
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image TEXT,
    category TEXT,
    tags TEXT[],
    author TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 10. HERO SLIDES TABLE
CREATE TABLE public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT NOT NULL,
    video TEXT,
    cta_text TEXT,
    cta_link TEXT,
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- 11. SITE SETTINGS TABLE
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 12. MEMBERSHIP APPLICATIONS TABLE
CREATE TABLE public.membership_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT,
    category TEXT,
    skills TEXT[],
    bio TEXT,
    portfolio_links TEXT[],
    profile_photo TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- 13. CONTACT MESSAGES TABLE
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;