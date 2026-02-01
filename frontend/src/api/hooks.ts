import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './endpoints';
import type { ApiParams, MembershipFormPayload, ContactFormPayload } from '@/types';

// Site Settings
export function useSiteSettings() {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: api.getSiteSettings,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Home Page
export function useHome() {
  return useQuery({
    queryKey: ['home'],
    queryFn: api.getHome,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Artists
export function useArtists(params: ApiParams = {}) {
  return useQuery({
    queryKey: ['artists', params],
    queryFn: () => api.getArtists(params),
  });
}

export function useArtist(slug: string) {
  return useQuery({
    queryKey: ['artist', slug],
    queryFn: () => api.getArtist(slug),
    enabled: !!slug,
  });
}

export function useArtistCategories() {
  return useQuery({
    queryKey: ['artistCategories'],
    queryFn: api.getArtistCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Projects
export function useProjects(params: ApiParams = {}) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => api.getProjects(params),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.getProject(slug),
    enabled: !!slug,
  });
}

// Media
export function useMedia(params: ApiParams = {}) {
  return useQuery({
    queryKey: ['media', params],
    queryFn: () => api.getMedia(params),
  });
}

export function useMediaItem(type: string, slug: string) {
  return useQuery({
    queryKey: ['mediaItem', type, slug],
    queryFn: () => api.getMediaItem(type, slug),
    enabled: !!type && !!slug,
  });
}

export function useMediaCategories() {
  return useQuery({
    queryKey: ['mediaCategories'],
    queryFn: api.getMediaCategories,
    staleTime: 1000 * 60 * 30,
  });
}

// Posts
export function usePosts(params: ApiParams = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => api.getPosts(params),
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => api.getPost(slug),
    enabled: !!slug,
  });
}

// About
export function useAboutContent() {
  return useQuery({
    queryKey: ['aboutContent'],
    queryFn: api.getAboutContent,
    staleTime: 1000 * 60 * 60,
  });
}

// Membership
export function useMembershipInfo() {
  return useQuery({
    queryKey: ['membershipInfo'],
    queryFn: api.getMembershipInfo,
    staleTime: 1000 * 60 * 60,
  });
}

// Birthdays
export function useTodayBirthdays() {
  return useQuery({
    queryKey: ['birthdays', 'today'],
    queryFn: api.getTodayBirthdays,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSubmitMembership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MembershipFormPayload) => api.submitMembership(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership'] });
    },
  });
}

// Contact
export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: ContactFormPayload) => api.submitContact(data),
  });
}
