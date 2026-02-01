import { USE_MOCK_API, apiClient } from './client';
import * as mockData from './mockData';
import type { 
  ApiParams, 
  PaginatedResponse, 
  Artist, 
  Project, 
  MediaItem, 
  Post,
  MembershipFormPayload,
  ContactFormPayload 
} from '@/types';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to paginate data
function paginate<T>(data: T[], page: number = 1, pageSize: number = 12): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: data.slice(start, end),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
}

// Normalize Laravel pagination shape to frontend shape
function normalizePaginated<T>(response: any): PaginatedResponse<T> {
  if (!response) {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };
  }
  const data = response.data ?? [];
  const meta = response.meta ?? {};
  const page = meta.current_page ?? 1;
  const pageSize = meta.per_page ?? data.length ?? 10;
  const total = meta.total ?? data.length ?? 0;
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1,
  };
}

const normalizeGalleryItem = (item: any) => ({
  ...item,
  thumbnail: item?.thumbnail,
  focal_point: item?.focal_point ?? item?.focalPoint,
});

const normalizeArtist = (artist: any) => ({
  ...artist,
  coverImage: artist.cover_image ?? artist.coverImage ?? artist.photo,
  category: artist.category,
  gallery: (artist.gallery ?? artist.gallery_items ?? []).map(normalizeGalleryItem),
  socialLinks: artist.socialLinks ?? {
    facebook: artist.social_facebook,
    instagram: artist.social_instagram,
    youtube: artist.social_youtube,
  },
});

// Site Settings
export async function getSiteSettings() {
  if (USE_MOCK_API) {
    await delay(100);
    return mockData.siteSettings;
  }
  try {
    const response = await apiClient.get('/site-settings');
    return response.data;
  } catch {
    return mockData.siteSettings;
  }
}

// Home Page Data
export async function getHome() {
  if (USE_MOCK_API) {
    await delay(200);
    return {
      slides: mockData.heroSlides,
      featuredArtists: mockData.artists.filter(a => a.featured).slice(0, 8),
      featuredProjects: mockData.projects.filter(p => p.featured).slice(0, 4),
      featuredMedia: mockData.mediaItems.filter(m => m.featured).slice(0, 4),
      latestPosts: mockData.posts.slice(0, 3),
      programs: mockData.programs,
    };
  }
  const [slidesRes, artistsRes, projectsRes, mediaRes, postsRes] = await Promise.all([
    apiClient.get('/hero-slides', { params: { active: true, per_page: 5 } }),
    apiClient.get('/artists', { params: { featured: true, per_page: 8 } }),
    apiClient.get('/projects', { params: { featured: true, per_page: 4 } }),
    apiClient.get('/media', { params: { featured: true, per_page: 4 } }),
    apiClient.get('/posts', { params: { featured: true, per_page: 3 } }),
  ]);

  const unwrap = (res: any) => res.data?.data || res.data || [];

  return {
    slides: unwrap(slidesRes),
    featuredArtists: unwrap(artistsRes).map(normalizeArtist),
    featuredProjects: unwrap(projectsRes),
    featuredMedia: unwrap(mediaRes),
    latestPosts: unwrap(postsRes),
    programs: mockData.programs,
  };
}

// Artists
export async function getArtists(params: ApiParams = {}): Promise<PaginatedResponse<Artist>> {
  if (USE_MOCK_API) {
    await delay(300);
    let filtered = [...mockData.artists];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search) ||
        a.bio.toLowerCase().includes(search)
      );
    }
    
    if (params.category) {
      filtered = filtered.filter(a => a.category.slug === params.category);
    }
    
    return paginate(filtered, params.page, params.pageSize);
  }
  const response = await apiClient.get('/artists', { params: { ...params, per_page: params.pageSize } });
  const paginated = normalizePaginated<any>(response.data);
  return {
    ...paginated,
    data: paginated.data.map(normalizeArtist),
  };
}

export async function getArtist(slug: string): Promise<Artist | null> {
  if (USE_MOCK_API) {
    await delay(200);
    return mockData.artists.find(a => a.slug === slug) || null;
  }
  const response = await apiClient.get(`/artists/${slug}`);
  return normalizeArtist(response.data);
}

export async function getArtistCategories() {
  if (USE_MOCK_API) {
    await delay(100);
    return mockData.artistCategories;
  }
  const response = await apiClient.get('/artist-categories');
  return response.data;
}

// Projects
export async function getProjects(params: ApiParams = {}): Promise<PaginatedResponse<Project>> {
  if (USE_MOCK_API) {
    await delay(300);
    let filtered = [...mockData.projects];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }
    
    if (params.type) {
      filtered = filtered.filter(p => p.type === params.type);
    }
    
    if (params.status) {
      filtered = filtered.filter(p => p.status === params.status);
    }
    
    return paginate(filtered, params.page, params.pageSize);
  }
  const response = await apiClient.get('/projects', { params: { ...params, per_page: params.pageSize } });
  return normalizePaginated<Project>(response.data);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (USE_MOCK_API) {
    await delay(200);
    return mockData.projects.find(p => p.slug === slug) || null;
  }
  const response = await apiClient.get(`/projects/${slug}`);
  return response.data;
}

// Media
export async function getMedia(params: ApiParams = {}): Promise<PaginatedResponse<MediaItem>> {
  if (USE_MOCK_API) {
    await delay(300);
    let filtered = [...mockData.mediaItems];
    
    if (params.type) {
      filtered = filtered.filter(m => m.type === params.type);
    }
    
    if (params.category) {
      filtered = filtered.filter(m => m.category.slug === params.category);
    }
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(search)
      );
    }
    
    return paginate(filtered, params.page, params.pageSize);
  }
  const response = await apiClient.get('/media', { params: { ...params, per_page: params.pageSize } });
  return normalizePaginated<MediaItem>(response.data);
}

export async function getMediaItem(type: string, slug: string): Promise<MediaItem | null> {
  if (USE_MOCK_API) {
    await delay(200);
    return mockData.mediaItems.find(m => m.type === type && m.slug === slug) || null;
  }
  const response = await apiClient.get(`/media/${slug}`);
  return response.data;
}

export async function getMediaCategories() {
  if (USE_MOCK_API) {
    await delay(100);
    return mockData.mediaCategories;
  }
  const response = await apiClient.get('/media-categories');
  return response.data;
}

// Posts
export async function getPosts(params: ApiParams = {}): Promise<PaginatedResponse<Post>> {
  if (USE_MOCK_API) {
    await delay(300);
    let filtered = [...mockData.posts];
    
    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.excerpt.toLowerCase().includes(search)
      );
    }
    
    if (params.category) {
      filtered = filtered.filter(p => p.category === params.category);
    }
    
    return paginate(filtered, params.page, params.pageSize);
  }
  const response = await apiClient.get('/posts', { params: { ...params, per_page: params.pageSize } });
  return normalizePaginated<Post>(response.data);
}

export async function getPost(slug: string): Promise<Post | null> {
  if (USE_MOCK_API) {
    await delay(200);
    return mockData.posts.find(p => p.slug === slug) || null;
  }
  const response = await apiClient.get(`/posts/${slug}`);
  return response.data;
}

// Forms
export async function submitMembership(data: MembershipFormPayload) {
  if (USE_MOCK_API) {
    await delay(500);
    console.log('Membership submission:', data);
    return { success: true, message: 'Application submitted successfully!' };
  }
  const payload: any = { ...data };
  delete payload.profilePhoto;
  delete payload.dateOfBirth;

  let profilePhotoUrl: string | undefined = undefined;
  if (data.profilePhoto instanceof File) {
    const formData = new FormData();
    formData.append('file', data.profilePhoto);
    formData.append('folder', 'applications');
    const uploadRes = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    profilePhotoUrl = uploadRes.data.url;
  } else if (typeof data.profilePhoto === 'string') {
    profilePhotoUrl = data.profilePhoto;
  }

  const response = await apiClient.post('/membership-applications', {
    ...payload,
    date_of_birth: data.dateOfBirth || null,
    skills: data.skills,
    portfolio_links: data.portfolioLinks,
    profile_photo: profilePhotoUrl,
  });
  return response.data;
}

export async function submitContact(data: ContactFormPayload) {
  if (USE_MOCK_API) {
    await delay(500);
    console.log('Contact submission:', data);
    return { success: true, message: 'Message sent successfully!' };
  }
  const response = await apiClient.post('/contact-messages', data);
  return response.data;
}

// About Page
export async function getAboutContent() {
  if (USE_MOCK_API) {
    await delay(100);
    return mockData.aboutContent;
  }
  return mockData.aboutContent;
}

// Membership Info
export async function getMembershipInfo() {
  if (USE_MOCK_API) {
    await delay(100);
    return {
      benefits: mockData.membershipBenefits,
      eligibility: mockData.membershipEligibility,
    };
  }
  return {
    benefits: mockData.membershipBenefits,
    eligibility: mockData.membershipEligibility,
  };
}

// Birthdays
export async function getTodayBirthdays() {
  if (USE_MOCK_API) {
    await delay(100);
    return [
      {
        id: 'artist-birthday-1',
        name: 'Karthik Ramasamy',
        photo: mockData.artists[0]?.photo,
        type: 'artist',
        slug: mockData.artists[0]?.slug,
        date_of_birth: '1990-01-15',
      },
      {
        id: 'member-birthday-1',
        name: 'Community Member',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        type: 'member',
        date_of_birth: '1996-01-15',
      },
    ];
  }

  const response = await apiClient.get('/birthdays/today');
  return response.data?.data ?? response.data;
}
