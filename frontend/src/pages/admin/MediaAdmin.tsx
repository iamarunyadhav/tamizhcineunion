import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { adminMedia } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  thumbnail: string | null;
  url: string;
  description: string | null;
  duration: string | null;
  featured: boolean;
  category_id?: string | null;
}

const MEDIA_TYPES = ['video', 'photo', 'audio', 'document'];

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function MediaAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'video',
    thumbnail: '',
    url: '',
    description: '',
    duration: '',
    featured: false,
  });

  const { data: mediaItems = [], isLoading } = useQuery({
    queryKey: ['admin-media', search, filterType],
    queryFn: async () => {
      const data = await adminMedia.list({
        search,
        type: filterType !== 'all' ? filterType : undefined,
      });
      return data as MediaItem[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const mediaData = {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        type: data.type as 'video' | 'photo' | 'audio' | 'document',
        thumbnail: data.thumbnail || null,
        url: data.url,
        description: data.description || null,
        duration: data.duration || null,
        featured: data.featured,
      };

      if (data.id) {
        await adminMedia.update(editingItem?.slug || data.slug || data.id, mediaData);
      } else {
        await adminMedia.create(mediaData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingItem ? 'Media updated!' : 'Media created!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => adminMedia.remove(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-media'] });
      toast.success('Media deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      type: 'video',
      thumbnail: '',
      url: '',
      description: '',
      duration: '',
      featured: false,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      type: item.type,
      thumbnail: item.thumbnail || '',
      url: item.url,
      description: item.description || '',
      duration: item.duration || '',
      featured: item.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: MediaItem) => {
    if (confirm(`Delete "${item.title}"?`)) {
      deleteMutation.mutate(item.slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingItem?.id,
    });
  };

  const columns: Column<MediaItem>[] = [
    {
      key: 'thumbnail',
      header: 'Thumbnail',
      render: (item) => (
        <img
          src={item.thumbnail || '/placeholder.svg'}
          alt={item.title}
          className="w-16 h-10 rounded object-cover"
        />
      ),
    },
    { key: 'title', header: 'Title' },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className={cn(
          "px-2 py-1 rounded text-xs capitalize",
          item.type === 'video' && "bg-burgundy/20 text-burgundy",
          item.type === 'photo' && "bg-teal/20 text-teal",
          item.type === 'audio' && "bg-purple-600/20 text-purple-400",
          item.type === 'document' && "bg-blue-600/20 text-blue-400",
        )}>
          {item.type}
        </span>
      ),
    },
    { key: 'duration', header: 'Duration' },
    {
      key: 'featured',
      header: 'Featured',
      render: (item) => (
        <span className={item.featured ? 'text-primary' : 'text-muted-foreground'}>
          {item.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Media</h1>
        <Button variant="gold" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {MEDIA_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={mediaItems}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Media' : 'Add New Media'}
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
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL * (YouTube link, file URL, etc.)</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <FileUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                folder="media-thumbnails"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="3:45"
                />
              </div>
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="featured">Featured</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Media'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
