import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { adminArtists } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

interface Artist {
  id: string;
  name: string;
  slug: string;
  date_of_birth?: string | null;
  photo: string | null;
  category_id: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  featured: boolean;
  category?: { name: string; parent?: { name: string } } | null;
}

interface ArtistCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  children?: ArtistCategory[];
}

interface GalleryItem {
  id: string;
  artist_id: string;
  type: 'photo' | 'video';
  title?: string;
  url: string;
  thumbnail?: string;
  focal_point?: { x: number; y: number };
  is_cover_candidate?: boolean;
  position: number;
}

const generateSlug = (name: string) => 
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const normalizeDateInput = (value?: string | null) => {
  if (!value) return '';
  return value.includes('T') ? value.split('T')[0] : value;
};

export default function ArtistsAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    date_of_birth: '',
    photo: '',
    category_id: '',
    location: '',
    bio: '',
    skills: '',
    featured: false,
  });
  const [galleryArtist, setGalleryArtist] = useState<Artist | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    type: 'photo' as 'photo' | 'video',
    title: '',
    url: '',
    thumbnail: '',
    position: '',
    is_cover_candidate: true,
    focal_x: 50,
    focal_y: 35,
  });

  // Fetch artists
  const { data: artists = [], isLoading } = useQuery({
    queryKey: ['admin-artists', search],
    queryFn: async () => {
      const data = await adminArtists.list({ search });
      return data as Artist[];
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['artist-categories'],
    queryFn: async () => {
      const data = await adminArtists.categories();
      return data as ArtistCategory[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const artistData = {
        name: data.name,
        slug: data.slug || generateSlug(data.name),
        date_of_birth: data.date_of_birth || null,
        photo: data.photo || null,
        category_id: data.category_id || null,
        location: data.location || null,
        bio: data.bio || null,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : null,
        featured: data.featured,
      };

      if (data.id) {
        await adminArtists.update(editingArtist?.slug || data.slug || data.id, artistData);
      } else {
        await adminArtists.create(artistData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingArtist ? 'Artist updated!' : 'Artist created!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => adminArtists.remove(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-artists'] });
      toast.success('Artist deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetGalleryForm = () => {
    setGalleryForm({
      type: 'photo',
      title: '',
      url: '',
      thumbnail: '',
      position: '',
      is_cover_candidate: true,
      focal_x: 50,
      focal_y: 35,
    });
  };

  const loadGallery = async (artist: Artist) => {
    try {
      setGalleryLoading(true);
      const items = await adminArtists.gallery(artist.slug);
      setGalleryItems(items as GalleryItem[]);
      setGalleryArtist(artist);
      resetGalleryForm();
    } catch (error: any) {
      toast.error(error.message || 'Unable to load gallery');
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleGalleryAdd = async () => {
    if (!galleryArtist) return;
    if (!galleryForm.url) {
      toast.error('Add an image or video URL first');
      return;
    }

    const payload: any = {
      type: galleryForm.type,
      title: galleryForm.title || null,
      url: galleryForm.url,
      thumbnail: galleryForm.thumbnail || null,
      position: galleryForm.position ? Number(galleryForm.position) : undefined,
      is_cover_candidate: galleryForm.is_cover_candidate,
    };

    if (galleryForm.type === 'photo') {
      payload.focal_point = {
        x: galleryForm.focal_x / 100,
        y: galleryForm.focal_y / 100,
      };
    }

    try {
      await adminArtists.addGallery(galleryArtist.slug, payload);
      toast.success('Gallery item added');
      await loadGallery(galleryArtist);
      resetGalleryForm();
    } catch (error: any) {
      toast.error(error.message || 'Unable to save gallery item');
    }
  };

  const handleGalleryUpdate = async (item: GalleryItem, changes: Partial<GalleryItem>) => {
    if (!galleryArtist) return;
    try {
      await adminArtists.updateGallery(galleryArtist.slug, item.id, {
        ...changes,
      });
      await loadGallery(galleryArtist);
    } catch (error: any) {
      toast.error(error.message || 'Unable to update item');
    }
  };

  const handleGalleryDelete = async (item: GalleryItem) => {
    if (!galleryArtist) return;
    if (!confirm('Remove this gallery item?')) return;
    try {
      await adminArtists.removeGallery(galleryArtist.slug, item.id);
      await loadGallery(galleryArtist);
      toast.success('Item removed');
    } catch (error: any) {
      toast.error(error.message || 'Unable to delete item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      date_of_birth: '',
      photo: '',
      category_id: '',
      location: '',
      bio: '',
      skills: '',
      featured: false,
    });
    setEditingArtist(null);
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      slug: artist.slug,
      date_of_birth: normalizeDateInput(artist.date_of_birth),
      photo: artist.photo || '',
      category_id: artist.category_id || '',
      location: artist.location || '',
      bio: artist.bio || '',
      skills: artist.skills?.join(', ') || '',
      featured: artist.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (artist: Artist) => {
    if (confirm(`Delete artist "${artist.name}"?`)) {
      deleteMutation.mutate(artist.slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingArtist?.id,
    });
  };

  const columns: Column<Artist>[] = [
    {
      key: 'photo',
      header: 'Photo',
      render: (artist) => (
        <img
          src={artist.photo || '/placeholder.svg'}
          alt={artist.name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },
    { key: 'name', header: 'Name' },
    {
      key: 'category',
      header: 'Category',
      render: (artist) => {
        if (artist.category?.parent?.name) {
          return `${artist.category.parent.name} · ${artist.category.name}`;
        }
        return artist.category?.name || '-';
      },
    },
    { key: 'location', header: 'Location' },
    {
      key: 'featured',
      header: 'Featured',
      render: (artist) => (
        <span className={artist.featured ? 'text-primary' : 'text-muted-foreground'}>
          {artist.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Artists</h1>
        <Button variant="gold" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Artist
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={artists}
        isLoading={isLoading}
        onEdit={handleEdit}
        onView={loadGallery}
        onDelete={handleDelete}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArtist ? 'Edit Artist' : 'Add New Artist'}
            </DialogTitle>
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
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated from name"
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <div key={cat.id}>
                        <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          {cat.name}
                        </div>
                        {(cat.children || []).map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo</Label>
              <FileUpload
                value={formData.photo}
                onChange={(url) => setFormData({ ...formData, photo: url })}
                folder="artists"
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
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Acting, Singing, Dancing"
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
              <Label htmlFor="featured">Featured Artist</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Artist'}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={!!galleryArtist} onOpenChange={(open) => { if (!open) { setGalleryArtist(null); setGalleryItems([]); } }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {galleryArtist ? `${galleryArtist.name} – Gallery` : 'Gallery'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {galleryLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : galleryItems.length === 0 ? (
                <div className="text-muted-foreground text-sm">No gallery items yet</div>
              ) : (
                galleryItems.map((item) => (
                  <div key={item.id} className="flex gap-3 border rounded-lg p-3 bg-secondary/40">
                    <div className="w-28 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.thumbnail || item.url}
                        alt={item.title || 'media'}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: `${((item.focal_point?.x ?? 0.5) * 100).toFixed(1)}% ${((item.focal_point?.y ?? 0.5) * 100).toFixed(1)}%`,
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold leading-tight">{item.title || 'Untitled'}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.url}</p>
                        </div>
                        <span className="text-[11px] uppercase tracking-wide px-2 py-1 rounded-full bg-primary/10 text-primary">
                          {item.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Order</Label>
                          <Input
                            type="number"
                            className="w-20 h-9"
                            defaultValue={item.position ?? 0}
                            onBlur={(e) => handleGalleryUpdate(item, { position: Number(e.target.value || 0) })}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            id={`cover-${item.id}`}
                            checked={item.is_cover_candidate !== false}
                            onCheckedChange={(checked) => handleGalleryUpdate(item, { is_cover_candidate: checked })}
                          />
                          <Label htmlFor={`cover-${item.id}`} className="text-xs">Use in cover slider</Label>
                        </div>

                        {item.type === 'photo' && (
                          <div className="flex items-center gap-2">
                            <Label className="text-xs whitespace-nowrap">Focus</Label>
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="w-16 h-9"
                              defaultValue={Math.round((item.focal_point?.x ?? 0.5) * 100)}
                              onBlur={(e) => handleGalleryUpdate(item, {
                                focal_point: {
                                  x: Number(e.target.value || 50) / 100,
                                  y: item.focal_point?.y ?? 0.5,
                                },
                              })}
                            />
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              className="w-16 h-9"
                              defaultValue={Math.round((item.focal_point?.y ?? 0.5) * 100)}
                              onBlur={(e) => handleGalleryUpdate(item, {
                                focal_point: {
                                  x: item.focal_point?.x ?? 0.5,
                                  y: Number(e.target.value || 50) / 100,
                                },
                              })}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleGalleryDelete(item)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add new gallery item */}
            <div className="border rounded-lg p-4 space-y-4 bg-secondary/30">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Add item</Label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md border ${galleryForm.type === 'photo' ? 'border-primary text-primary' : 'border-border text-foreground'}`}
                  onClick={() => setGalleryForm({ ...galleryForm, type: 'photo' })}
                >
                  Photo
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md border ${galleryForm.type === 'video' ? 'border-primary text-primary' : 'border-border text-foreground'}`}
                  onClick={() => setGalleryForm({ ...galleryForm, type: 'video' })}
                >
                  Video
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gallery-title">Title</Label>
                <Input
                  id="gallery-title"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="Optional title"
                />
              </div>

              {galleryForm.type === 'photo' ? (
                <div className="space-y-2">
                  <Label>Image</Label>
                  <FileUpload
                    value={galleryForm.url}
                    onChange={(url) => setGalleryForm({ ...galleryForm, url })}
                    folder="artist-gallery"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL</Label>
                    <Input
                      id="video-url"
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom Thumbnail (optional)</Label>
                    <FileUpload
                      value={galleryForm.thumbnail}
                      onChange={(url) => setGalleryForm({ ...galleryForm, thumbnail: url })}
                      folder="artist-gallery"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="position">Order</Label>
                  <Input
                    id="position"
                    type="number"
                    value={galleryForm.position}
                    onChange={(e) => setGalleryForm({ ...galleryForm, position: e.target.value })}
                    placeholder="Auto"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Cover slider</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={galleryForm.is_cover_candidate}
                      onCheckedChange={(checked) => setGalleryForm({ ...galleryForm, is_cover_candidate: checked })}
                    />
                    <span className="text-sm text-muted-foreground">Rotate in cover</span>
                  </div>
                </div>
              </div>

              {galleryForm.type === 'photo' && (
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Focus point (drag sliders so the face stays centered)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted-foreground">Horizontal</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={galleryForm.focal_x}
                        onChange={(e) => setGalleryForm({ ...galleryForm, focal_x: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Vertical</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={galleryForm.focal_y}
                        onChange={(e) => setGalleryForm({ ...galleryForm, focal_y: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button variant="gold" onClick={handleGalleryAdd} disabled={galleryLoading}>
                Add to Gallery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
