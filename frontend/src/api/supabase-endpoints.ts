import { supabase } from '@/integrations/supabase/client';
import type { 
  ApiParams, 
  PaginatedResponse, 
  Artist, 
  Project, 
  MediaItem, 
  Post,
  ArtistCategory,
  MediaCategory,
  HeroSlide,
  MembershipFormPayload,
  ContactFormPayload 
} from '@/types';
import type { Tables } from '@/integrations/supabase/types';

// Helper to paginate data
function createPaginatedResponse<T>(
  data: T[], 
  total: number, 
  page: number, 
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Transform Supabase artist to frontend Artist type
function transformArtist(row: Tables<'artists'> & { artist_categories?: Tables<'artist_categories'> | null }): Artist {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    photo: row.photo || '/placeholder.svg',
    coverImage: row.cover_image || undefined,
    category: row.artist_categories ? {
      id: row.artist_categories.id,
      name: row.artist_categories.name,
      slug: row.artist_categories.slug,
      count: 0,
    } : { id: '', name: 'Uncategorized', slug: 'uncategorized', count: 0 },
    location: row.location || '',
    bio: row.bio || '',
    skills: row.skills || [],
    socialLinks: {
      facebook: row.social_facebook || undefined,
      instagram: row.social_instagram || undefined,
      youtube: row.social_youtube || undefined,
    },
    featured: row.featured || false,
    createdAt: row.created_at,
  };
}

// Transform Supabase project to frontend Project type
function transformProject(row: Tables<'projects'>, credits?: { role: string; artist_id: string; artists?: { name: string } | null }[]): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    status: row.status,
    thumbnail: row.thumbnail || '/placeholder.svg',
    bannerImage: row.banner_image || undefined,
    description: row.description || '',
    synopsis: row.synopsis || undefined,
    credits: credits?.map(c => ({
      role: c.role,
      artistId: c.artist_id,
      artistName: c.artists?.name || 'Unknown',
    })) || [],
    releaseDate: row.release_date || undefined,
    featured: row.featured || false,
    createdAt: row.created_at,
  };
}

// Transform Supabase media item to frontend MediaItem type
function transformMediaItem(row: Tables<'media_items'> & { media_categories?: Tables<'media_categories'> | null }): MediaItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    type: row.type,
    category: row.media_categories ? {
      id: row.media_categories.id,
      name: row.media_categories.name,
      slug: row.media_categories.slug,
      type: row.media_categories.type,
    } : { id: '', name: 'Uncategorized', slug: 'uncategorized', type: row.type },
    thumbnail: row.thumbnail || '/placeholder.svg',
    url: row.url,
    description: row.description || undefined,
    duration: row.duration || undefined,
    artistId: row.artist_id || undefined,
    projectId: row.project_id || undefined,
    featured: row.featured || false,
    createdAt: row.created_at,
  };
}

// Transform Supabase post to frontend Post type
function transformPost(row: Tables<'posts'>): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    content: row.content || '',
    coverImage: row.cover_image || '/placeholder.svg',
    category: row.category || 'General',
    tags: row.tags || [],
    author: row.author || 'TAMIZHCINEUNION',
    publishedAt: row.published_at || row.created_at,
    featured: row.featured || false,
  };
}

// Transform hero slide
function transformHeroSlide(row: Tables<'hero_slides'>): HeroSlide {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    image: row.image,
    video: row.video || undefined,
    ctaText: row.cta_text || undefined,
    ctaLink: row.cta_link || undefined,
  };
}

// ========== API Functions ==========

// Home Page Data
export async function getHome() {
  const [slidesRes, artistsRes, projectsRes, mediaRes, postsRes] = await Promise.all([
    supabase.from('hero_slides').select('*').eq('active', true).order('sort_order'),
    supabase.from('artists').select('*, artist_categories(*)').eq('featured', true).limit(8),
    supabase.from('projects').select('*').eq('featured', true).limit(4),
    supabase.from('media_items').select('*, media_categories(*)').eq('featured', true).limit(4),
    supabase.from('posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
  ]);

  return {
    slides: (slidesRes.data || []).map(transformHeroSlide),
    featuredArtists: (artistsRes.data || []).map(transformArtist),
    featuredProjects: (projectsRes.data || []).map(p => transformProject(p)),
    featuredMedia: (mediaRes.data || []).map(transformMediaItem),
    latestPosts: (postsRes.data || []).map(transformPost),
    programs: [
      { id: '1', title: 'Skill Development', description: 'Workshops and training programs', icon: 'Lightbulb', features: ['Acting workshops', 'Technical training', 'Script writing'] },
      { id: '2', title: 'Production Support', description: 'Resources for creative projects', icon: 'Film', features: ['Equipment access', 'Crew networking', 'Funding guidance'] },
      { id: '3', title: 'Community Network', description: 'Connect with fellow artists', icon: 'Globe', features: ['Industry events', 'Collaboration platform', 'Mentorship program'] },
    ],
  };
}

// Artists
export async function getArtists(params: ApiParams = {}): Promise<PaginatedResponse<Artist>> {
  const { search, category, page = 1, pageSize = 12 } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('artists')
    .select('*, artist_categories(*)', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%`);
  }

  if (category) {
    const { data: cat } = await supabase.from('artist_categories').select('id').eq('slug', category).single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  const { data, count, error } = await query.order('name').range(from, to);

  if (error) throw error;

  return createPaginatedResponse(
    (data || []).map(transformArtist),
    count || 0,
    page,
    pageSize
  );
}

export async function getArtist(slug: string): Promise<Artist | null> {
  const { data, error } = await supabase
    .from('artists')
    .select('*, artist_categories(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return transformArtist(data);
}

export async function getArtistCategories(): Promise<ArtistCategory[]> {
  const { data, error } = await supabase
    .from('artist_categories')
    .select('*')
    .order('name');

  if (error) throw error;

  // Get counts for each category
  const categories = await Promise.all(
    (data || []).map(async (cat) => {
      const { count } = await supabase
        .from('artists')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);
      
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: count || 0,
      };
    })
  );

  return categories;
}

// Projects
export async function getProjects(params: ApiParams = {}): Promise<PaginatedResponse<Project>> {
  const { search, type, status, page = 1, pageSize = 8 } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (type) {
    query = query.eq('type', type as 'film' | 'theatre' | 'music' | 'visual' | 'documentary');
  }

  if (status) {
    query = query.eq('status', status as 'ongoing' | 'completed' | 'upcoming');
  }

  const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

  if (error) throw error;

  return createPaginatedResponse(
    (data || []).map(p => transformProject(p)),
    count || 0,
    page,
    pageSize
  );
}

export async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  // Get credits
  const { data: credits } = await supabase
    .from('project_credits')
    .select('role, artist_id, artists(name)')
    .eq('project_id', data.id);

  return transformProject(data, credits || []);
}

// Media
export async function getMedia(params: ApiParams = {}): Promise<PaginatedResponse<MediaItem>> {
  const { type, category, search, page = 1, pageSize = 12 } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('media_items')
    .select('*, media_categories(*)', { count: 'exact' });

  if (type) {
    query = query.eq('type', type as 'video' | 'photo' | 'audio' | 'document');
  }

  if (category) {
    const { data: cat } = await supabase.from('media_categories').select('id').eq('slug', category).single();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, to);

  if (error) throw error;

  return createPaginatedResponse(
    (data || []).map(transformMediaItem),
    count || 0,
    page,
    pageSize
  );
}

export async function getMediaItem(type: string, slug: string): Promise<MediaItem | null> {
  const { data, error } = await supabase
    .from('media_items')
    .select('*, media_categories(*)')
    .eq('type', type as 'video' | 'photo' | 'audio' | 'document')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return transformMediaItem(data);
}

export async function getMediaCategories(): Promise<MediaCategory[]> {
  const { data, error } = await supabase
    .from('media_categories')
    .select('*')
    .order('name');

  if (error) throw error;

  return (data || []).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    type: cat.type,
  }));
}

// Posts
export async function getPosts(params: ApiParams = {}): Promise<PaginatedResponse<Post>> {
  const { search, category, page = 1, pageSize = 9 } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('published', true);

  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data, count, error } = await query.order('published_at', { ascending: false }).range(from, to);

  if (error) throw error;

  return createPaginatedResponse(
    (data || []).map(transformPost),
    count || 0,
    page,
    pageSize
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return transformPost(data);
}

// Forms
export async function submitMembership(formData: MembershipFormPayload) {
  let profilePhotoUrl: string | null = null;

  // Upload profile photo if provided
  if (formData.profilePhoto) {
    const file = formData.profilePhoto;
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `applications/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
      profilePhotoUrl = urlData.publicUrl;
    }
  }

  const { error } = await supabase.from('membership_applications').insert({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    location: formData.location,
    category: formData.category,
    skills: formData.skills,
    bio: formData.bio,
    portfolio_links: formData.portfolioLinks,
    profile_photo: profilePhotoUrl,
    status: 'pending',
  });

  if (error) throw error;

  return { success: true, message: 'Application submitted successfully!' };
}

export async function submitContact(data: ContactFormPayload) {
  const { error } = await supabase.from('contact_messages').insert({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message,
    read: false,
  });

  if (error) throw error;

  return { success: true, message: 'Message sent successfully!' };
}

// Site Settings
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) throw error;

  // Convert array to object
  const settings: Record<string, any> = {};
  (data || []).forEach(row => {
    settings[row.key] = row.value;
  });

  return {
    siteName: settings.siteName || 'TAMIZHCINEUNION',
    tagline: settings.tagline || 'The Creative Hub of Hill Country Artists',
    logo: settings.logo || '/logo.png',
    address: settings.address || 'Hill Country, Sri Lanka',
    phone: settings.phone || ['+94 XX XXX XXXX'],
    email: settings.email || 'contact@tamizhcineunion.com',
    socialLinks: settings.socialLinks || {},
  };
}

// About Page
export async function getAboutContent() {
  return {
    intro: 'TAMIZHCINEUNION is a creative collective dedicated to uplifting and showcasing the artistic talents of the hill country Tamil community in Sri Lanka.',
    purpose: 'We exist to create a platform where Tamil artists from the hill country can showcase their talents, collaborate on projects, and grow professionally. Our goal is to bridge the gap between local talent and the broader creative industry.',
    connects: [
      'Filmmakers & Directors',
      'Actors & Performers',
      'Musicians & Composers',
      'Writers & Poets',
      'Visual Artists',
      'Technical Crew',
      'Creative Entrepreneurs'
    ],
    vision: 'A thriving creative community that produces world-class content and provides opportunities for all Tamil artists from the hill country to achieve their creative aspirations on regional and global stages.',
    mission: [
      'Unite Tamil creative professionals from the hill country region',
      'Provide training and skill development opportunities',
      'Facilitate collaboration on creative projects',
      'Showcase community talent through productions and events',
      'Create pathways for professional growth in the creative industry'
    ],
    belief: 'Every artist from our community has unique stories to tell and talents to share with the world. Together, we can create a creative renaissance.',
    history: 'Founded in 2020, TAMIZHCINEUNION has grown to become the leading platform for Tamil artists in the hill country region.',
    team: [],
  };
}

// Membership Info
export async function getMembershipInfo() {
  return {
    benefits: [
      { icon: 'Users', title: 'Community Access', description: 'Connect with fellow artists and industry professionals' },
      { icon: 'Camera', title: 'Equipment Access', description: 'Use professional equipment for your projects' },
      { icon: 'GraduationCap', title: 'Training Programs', description: 'Attend workshops and skill development sessions' },
      { icon: 'Handshake', title: 'Collaboration', description: 'Find collaborators for your creative projects' },
      { icon: 'Image', title: 'Portfolio Showcase', description: 'Feature your work on our platform' },
      { icon: 'Calendar', title: 'Events Access', description: 'Participate in exclusive events and screenings' },
    ],
    eligibility: [
      'Must be a Tamil artist from the hill country region',
      'Active in any creative field (film, music, theatre, etc.)',
      'Committed to community growth and collaboration',
    ],
  };
}
