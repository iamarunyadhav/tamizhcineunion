import { apiClient } from './client';

type PaginationResponse<T> = { data: T[]; meta?: { total?: number } } | T[];

const unwrap = <T>(res: PaginationResponse<T>): T[] => {
  if (Array.isArray(res)) return res;
  if ('data' in res) return res.data;
  return [] as T[];
};

const unwrapSingle = <T>(res: any): T => res?.data ?? res;

// Artists
export const adminArtists = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/artists', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async create(payload: any) {
    const res = await apiClient.post('/artists', payload);
    return unwrapSingle<any>(res.data);
  },
  async update(slug: string, payload: any) {
    const res = await apiClient.put(`/artists/${slug}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(slug: string) {
    await apiClient.delete(`/artists/${slug}`);
  },
  async categories() {
    const res = await apiClient.get('/artist-categories', { params: { per_page: 200 } });
    return unwrap<any>(res.data);
  },
  async gallery(slug: string) {
    const res = await apiClient.get(`/artists/${slug}/gallery`);
    return unwrap<any>(res.data);
  },
  async addGallery(slug: string, payload: any) {
    const res = await apiClient.post(`/artists/${slug}/gallery`, payload);
    return unwrap<any>(res.data);
  },
  async updateGallery(slug: string, id: string, payload: any) {
    const res = await apiClient.put(`/artists/${slug}/gallery/${id}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async removeGallery(slug: string, id: string) {
    await apiClient.delete(`/artists/${slug}/gallery/${id}`);
  },
};

// Projects
export const adminProjects = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/projects', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async create(payload: any) {
    const res = await apiClient.post('/projects', payload);
    return unwrapSingle<any>(res.data);
  },
  async update(slug: string, payload: any) {
    const res = await apiClient.put(`/projects/${slug}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(slug: string) {
    await apiClient.delete(`/projects/${slug}`);
  },
};

// Media
export const adminMedia = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/media', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async create(payload: any) {
    const res = await apiClient.post('/media', payload);
    return unwrapSingle<any>(res.data);
  },
  async update(slug: string, payload: any) {
    const res = await apiClient.put(`/media/${slug}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(slug: string) {
    await apiClient.delete(`/media/${slug}`);
  },
  async categories() {
    const res = await apiClient.get('/media-categories', { params: { per_page: 200 } });
    return unwrap<any>(res.data);
  },
};

// Posts
export const adminPosts = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/posts', { params: { per_page: 200, ...params, published: undefined } });
    return unwrap<any>(res.data);
  },
  async create(payload: any) {
    const res = await apiClient.post('/posts', payload);
    return unwrapSingle<any>(res.data);
  },
  async update(slug: string, payload: any) {
    const res = await apiClient.put(`/posts/${slug}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(slug: string) {
    await apiClient.delete(`/posts/${slug}`);
  },
};

// Hero slides
export const adminHeroSlides = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/hero-slides', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async create(payload: any) {
    const res = await apiClient.post('/hero-slides', payload);
    return unwrapSingle<any>(res.data);
  },
  async update(id: string, payload: any) {
    const res = await apiClient.put(`/hero-slides/${id}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(id: string) {
    await apiClient.delete(`/hero-slides/${id}`);
  },
};

// Membership
export const adminMemberships = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/membership-applications', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async update(id: string, payload: any) {
    const res = await apiClient.put(`/membership-applications/${id}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(id: string) {
    await apiClient.delete(`/membership-applications/${id}`);
  },
};

// Messages
export const adminMessages = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/contact-messages', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async update(id: string, payload: any) {
    const res = await apiClient.put(`/contact-messages/${id}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(id: string) {
    await apiClient.delete(`/contact-messages/${id}`);
  },
};

// Members
export const adminMembers = {
  async list(params: Record<string, any> = {}) {
    const res = await apiClient.get('/members', { params: { per_page: 200, ...params } });
    return unwrap<any>(res.data);
  },
  async create(payload: any) {
    const res = await apiClient.post('/members', payload);
    return unwrapSingle<any>(res.data);
  },
  async update(id: string, payload: any) {
    const res = await apiClient.put(`/members/${id}`, payload);
    return unwrapSingle<any>(res.data);
  },
  async remove(id: string) {
    await apiClient.delete(`/members/${id}`);
  },
};

// Dashboard counts helper
export const adminCounts = async () => {
  const [
    artists,
    projects,
    videos,
    photos,
    audio,
    posts,
    applications,
    messages,
  ] = await Promise.all([
    apiClient.get('/artists', { params: { per_page: 1 } }),
    apiClient.get('/projects', { params: { per_page: 1 } }),
    apiClient.get('/media', { params: { per_page: 1, type: 'video' } }),
    apiClient.get('/media', { params: { per_page: 1, type: 'photo' } }),
    apiClient.get('/media', { params: { per_page: 1, type: 'audio' } }),
    apiClient.get('/posts', { params: { per_page: 1, published: undefined } }),
    apiClient.get('/membership-applications', { params: { per_page: 1, status: 'pending' } }),
    apiClient.get('/contact-messages', { params: { per_page: 1, read: false } }),
  ]);

  const total = (res: any) =>
    res.data?.total ??
    res.data?.meta?.total ??
    (Array.isArray(res.data) ? res.data.length : 0);

  return {
    artists: total(artists),
    projects: total(projects),
    videos: total(videos),
    photos: total(photos),
    audio: total(audio),
    posts: total(posts),
    applications: total(applications),
    messages: total(messages),
  };
};
