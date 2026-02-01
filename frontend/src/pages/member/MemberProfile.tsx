import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/admin/FileUpload';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';

interface MemberProfileData {
  date_of_birth?: string | null;
  phone: string | null;
  location: string | null;
  category: string | null;
  skills: string[] | null;
  bio: string | null;
  portfolio_links: string[] | null;
  profile_photo: string | null;
}

export default function MemberProfile() {
  const { user, isLoading, isAdmin, isMember } = useAuth();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const normalizeDateInput = (value?: string | null) => {
    if (!value) return '';
    return value.includes('T') ? value.split('T')[0] : value;
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    date_of_birth: '',
    phone: '',
    location: '',
    category: '',
    skills: '',
    bio: '',
    portfolio_links: '',
    profile_photo: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/member/login');
      return;
    }

    if (!isLoading && user && isAdmin) {
      navigate('/admin');
      return;
    }

    if (!isLoading && user && !isMember) {
      navigate('/');
      return;
    }

    if (user) {
      const loadProfile = async () => {
        try {
          const { data } = await apiClient.get('/member/profile');
          const profile: MemberProfileData | null = data?.profile ?? null;
          setFormData({
            name: data?.user?.name || '',
            email: data?.user?.email || '',
            password: '',
            date_of_birth: normalizeDateInput(profile?.date_of_birth),
            phone: profile?.phone || '',
            location: profile?.location || '',
            category: profile?.category || '',
            skills: profile?.skills?.join(', ') || '',
            bio: profile?.bio || '',
            portfolio_links: profile?.portfolio_links?.join(', ') || '',
            profile_photo: profile?.profile_photo || '',
          });
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Failed to load profile.');
        } finally {
          setIsFetching(false);
        }
      };

      loadProfile();
    }
  }, [user, isLoading, isAdmin, isMember, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.name || null,
        password: formData.password || undefined,
        date_of_birth: formData.date_of_birth || null,
        phone: formData.phone || null,
        location: formData.location || null,
        category: formData.category || null,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : null,
        bio: formData.bio || null,
        portfolio_links: formData.portfolio_links
          ? formData.portfolio_links.split(',').map((s) => s.trim()).filter(Boolean)
          : null,
        profile_photo: formData.profile_photo || null,
      };

      await apiClient.put('/member/profile', payload);
      toast.success('Profile saved!');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageShell>
      <section className="py-20">
        <div className="section-container">
          <SectionTitle
            title="Member Profile"
            subtitle="Update your details so the community can find and collaborate with you."
          />

          <div className="glass-card p-8 max-w-4xl mx-auto">
            {isFetching ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={formData.email} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Leave blank to keep"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <FileUpload
                    value={formData.profile_photo}
                    onChange={(url) => setFormData({ ...formData, profile_photo: url })}
                    folder="members"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio_links">Portfolio Links (comma-separated)</Label>
                  <Input
                    id="portfolio_links"
                    value={formData.portfolio_links}
                    onChange={(e) => setFormData({ ...formData, portfolio_links: e.target.value })}
                    placeholder="https://example.com, https://youtube.com/..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" variant="gold" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
