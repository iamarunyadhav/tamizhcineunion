import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { adminProjects } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  thumbnail: string | null;
  description: string | null;
  featured: boolean;
}

const PROJECT_TYPES = ['film', 'theatre', 'music', 'visual', 'documentary'];
const PROJECT_STATUSES = ['ongoing', 'completed', 'upcoming'];

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ProjectsAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'film',
    status: 'upcoming',
    thumbnail: '',
    description: '',
    synopsis: '',
    featured: false,
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects', search],
    queryFn: async () => {
      const data = await adminProjects.list({ search });
      return data as Project[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const projectData = {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        type: data.type as 'film' | 'theatre' | 'music' | 'visual' | 'documentary',
        status: data.status as 'ongoing' | 'completed' | 'upcoming',
        thumbnail: data.thumbnail || null,
        description: data.description || null,
        synopsis: data.synopsis || null,
        featured: data.featured,
      };

      if (data.id) {
        await adminProjects.update(editingProject?.slug || data.slug || data.id, projectData);
      } else {
        await adminProjects.create(projectData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingProject ? 'Project updated!' : 'Project created!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

const deleteMutation = useMutation({
    mutationFn: async (slug: string) => adminProjects.remove(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast.success('Project deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      type: 'film',
      status: 'upcoming',
      thumbnail: '',
      description: '',
      synopsis: '',
      featured: false,
    });
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      type: project.type,
      status: project.status,
      thumbnail: project.thumbnail || '',
      description: project.description || '',
      synopsis: '',
      featured: project.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    if (confirm(`Delete project "${project.title}"?`)) {
      deleteMutation.mutate(project.slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingProject?.id,
    });
  };

  const columns: Column<Project>[] = [
    {
      key: 'thumbnail',
      header: 'Thumbnail',
      render: (project) => (
        <img
          src={project.thumbnail || '/placeholder.svg'}
          alt={project.title}
          className="w-16 h-10 rounded object-cover"
        />
      ),
    },
    { key: 'title', header: 'Title' },
    {
      key: 'type',
      header: 'Type',
      render: (project) => (
        <span className="capitalize">{project.type}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project) => (
        <span className="capitalize">{project.status}</span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (project) => (
        <span className={project.featured ? 'text-primary' : 'text-muted-foreground'}>
          {project.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Projects</h1>
        <Button variant="gold" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={projects}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <FileUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                folder="projects"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="synopsis">Synopsis</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
