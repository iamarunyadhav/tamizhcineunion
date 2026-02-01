import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { adminMembers } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';

interface MemberProfile {
  date_of_birth?: string | null;
  phone: string | null;
  location: string | null;
  category: string | null;
  skills: string[] | null;
  bio: string | null;
  portfolio_links: string[] | null;
  profile_photo: string | null;
}

interface Member {
  id: string;
  name: string;
  email: string;
  profile?: MemberProfile | null;
}

const emptyForm = {
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
};

export default function MembersAdmin() {
  const normalizeDateInput = (value?: string | null) => {
    if (!value) return '';
    return value.includes('T') ? value.split('T')[0] : value;
  };
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['admin-members', search],
    queryFn: async () => {
      const data = await adminMembers.list({ search });
      return (data as Member[]).map((member) => ({
        ...member,
        id: String(member.id),
      }));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const payload = {
        name: data.name || null,
        email: data.email || null,
        password: data.password || undefined,
        date_of_birth: data.date_of_birth || null,
        phone: data.phone || null,
        location: data.location || null,
        category: data.category || null,
        skills: data.skills ? data.skills.split(',').map((s) => s.trim()).filter(Boolean) : null,
        bio: data.bio || null,
        portfolio_links: data.portfolio_links
          ? data.portfolio_links.split(',').map((s) => s.trim()).filter(Boolean)
          : null,
        profile_photo: data.profile_photo || null,
      };

      if (data.id) {
        await adminMembers.update(data.id, payload);
      } else {
        await adminMembers.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      setIsDialogOpen(false);
      setFormData({ ...emptyForm });
      setEditingMember(null);
      toast.success(editingMember ? 'Member updated!' : 'Member created!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminMembers.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      toast.success('Member deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      date_of_birth: normalizeDateInput(member.profile?.date_of_birth),
      phone: member.profile?.phone || '',
      location: member.profile?.location || '',
      category: member.profile?.category || '',
      skills: member.profile?.skills?.join(', ') || '',
      bio: member.profile?.bio || '',
      portfolio_links: member.profile?.portfolio_links?.join(', ') || '',
      profile_photo: member.profile?.profile_photo || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (member: Member) => {
    if (confirm(`Delete member "${member.name}"?`)) {
      deleteMutation.mutate(member.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingMember?.id,
    });
  };

  const columns: Column<Member>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'phone',
      header: 'Phone',
      render: (member) => member.profile?.phone || '-',
    },
    {
      key: 'category',
      header: 'Category',
      render: (member) => member.profile?.category || '-',
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Members</h1>
        <Button
          variant="gold"
          onClick={() => {
            setEditingMember(null);
            setFormData({ ...emptyForm });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Edit Member' : 'Add Member'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {editingMember ? 'Reset Password' : 'Password *'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingMember ? 'Leave blank to keep' : 'Set temporary password'}
                  required={!editingMember}
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
                rows={4}
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
