// TAMIZHCINEUNION - Type Definitions

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  address: string;
  phone: string[];
  email: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ArtistCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  children?: ArtistCategory[];
  count?: number;
}

export interface ArtistGalleryItem {
  id: string;
  artist_id: string;
  type: 'photo' | 'video';
  title?: string;
  url: string;
  thumbnail?: string | null;
  focal_point?: { x: number; y: number } | null;
  is_cover_candidate?: boolean;
  position: number;
  created_at?: string;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  photo: string;
  coverImage?: string;
  category?: ArtistCategory;
  gallery?: ArtistGalleryItem[];
  location: string;
  bio: string;
  skills: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  featured: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  type: 'film' | 'theatre' | 'music' | 'visual' | 'documentary';
  status: 'ongoing' | 'completed' | 'upcoming';
  thumbnail: string;
  bannerImage?: string;
  description: string;
  synopsis?: string;
  credits: {
    role: string;
    artistId: string;
    artistName: string;
  }[];
  releaseDate?: string;
  featured: boolean;
  createdAt: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  slug: string;
  type: 'video' | 'photo' | 'audio' | 'document';
}

export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  type: 'video' | 'photo' | 'audio' | 'document';
  category: MediaCategory;
  thumbnail: string;
  url: string;
  description?: string;
  duration?: string;
  artistId?: string;
  projectId?: string;
  featured: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  featured: boolean;
}

export interface MembershipFormPayload {
  name: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  location: string;
  category: string;
  skills: string[];
  bio: string;
  portfolioLinks: string[];
  profilePhoto?: File;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  type?: string;
  status?: string;
  featured?: boolean;
}
