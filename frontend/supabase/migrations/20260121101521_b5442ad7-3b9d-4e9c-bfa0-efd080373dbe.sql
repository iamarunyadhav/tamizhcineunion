-- ========================================
-- RLS POLICIES + Storage + Triggers
-- ========================================

-- User Roles: Only admins can view
CREATE POLICY "Admins can view user_roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Artist Categories: Public read, admin write
CREATE POLICY "Anyone can view artist_categories" ON public.artist_categories
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert artist_categories" ON public.artist_categories
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update artist_categories" ON public.artist_categories
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete artist_categories" ON public.artist_categories
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Artists: Public read, admin write
CREATE POLICY "Anyone can view artists" ON public.artists
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert artists" ON public.artists
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update artists" ON public.artists
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete artists" ON public.artists
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Projects: Public read, admin write
CREATE POLICY "Anyone can view projects" ON public.projects
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert projects" ON public.projects
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Project Credits: Public read, admin write
CREATE POLICY "Anyone can view project_credits" ON public.project_credits
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert project_credits" ON public.project_credits
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update project_credits" ON public.project_credits
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete project_credits" ON public.project_credits
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Media Categories: Public read, admin write
CREATE POLICY "Anyone can view media_categories" ON public.media_categories
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert media_categories" ON public.media_categories
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media_categories" ON public.media_categories
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media_categories" ON public.media_categories
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Media Items: Public read, admin write
CREATE POLICY "Anyone can view media_items" ON public.media_items
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert media_items" ON public.media_items
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update media_items" ON public.media_items
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete media_items" ON public.media_items
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Posts: Public can see published, admin can see all
CREATE POLICY "Anyone can view published posts" ON public.posts
    FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert posts" ON public.posts
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update posts" ON public.posts
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete posts" ON public.posts
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Hero Slides: Public can see active, admin can see all
CREATE POLICY "Anyone can view active hero_slides" ON public.hero_slides
    FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert hero_slides" ON public.hero_slides
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hero_slides" ON public.hero_slides
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete hero_slides" ON public.hero_slides
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Site Settings: Public read, admin write
CREATE POLICY "Anyone can view site_settings" ON public.site_settings
    FOR SELECT USING (true);
CREATE POLICY "Admins can insert site_settings" ON public.site_settings
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site_settings" ON public.site_settings
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site_settings" ON public.site_settings
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Membership Applications: Anyone can insert, admin can view/update
CREATE POLICY "Anyone can submit membership_applications" ON public.membership_applications
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view membership_applications" ON public.membership_applications
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update membership_applications" ON public.membership_applications
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete membership_applications" ON public.membership_applications
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Contact Messages: Anyone can insert, admin can view/update
CREATE POLICY "Anyone can submit contact_messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact_messages" ON public.contact_messages
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact_messages" ON public.contact_messages
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact_messages" ON public.contact_messages
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- ========================================
-- STORAGE BUCKET for media uploads
-- ========================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media', 
    'media', 
    true,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf']
);

-- Storage policies
CREATE POLICY "Anyone can view media files" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update media files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete media files" ON storage.objects
    FOR DELETE USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- ========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON public.media_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON public.hero_slides
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_membership_applications_updated_at BEFORE UPDATE ON public.membership_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();