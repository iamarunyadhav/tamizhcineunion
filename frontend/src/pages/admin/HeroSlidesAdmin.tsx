import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, GripVertical } from 'lucide-react';
import { adminHeroSlides } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  video: string | null;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  active: boolean;
}

export default function HeroSlidesAdmin() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    video: '',
    cta_text: '',
    cta_link: '',
    sort_order: 0,
    active: true,
  });

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ['admin-hero-slides'],
    queryFn: async () => {
      const data = await adminHeroSlides.list({ per_page: 200 });
      return data as HeroSlide[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const slideData = {
        title: data.title,
        subtitle: data.subtitle || null,
        image: data.image,
        video: data.video || null,
        cta_text: data.cta_text || null,
        cta_link: data.cta_link || null,
        sort_order: data.sort_order,
        active: data.active,
      };

      if (data.id) {
        await adminHeroSlides.update(data.id, slideData);
      } else {
        await adminHeroSlides.create(slideData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingSlide ? 'Slide updated!' : 'Slide created!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminHeroSlides.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hero-slides'] });
      toast.success('Slide deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      video: '',
      cta_text: '',
      cta_link: '',
      sort_order: slides.length,
      active: true,
    });
    setEditingSlide(null);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      image: slide.image,
      video: slide.video || '',
      cta_text: slide.cta_text || '',
      cta_link: slide.cta_link || '',
      sort_order: slide.sort_order,
      active: slide.active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (slide: HeroSlide) => {
    if (confirm(`Delete slide "${slide.title}"?`)) {
      deleteMutation.mutate(slide.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingSlide?.id,
    });
  };

  const columns: Column<HeroSlide>[] = [
    {
      key: 'sort_order',
      header: '#',
      render: (slide) => (
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          {slide.sort_order + 1}
        </div>
      ),
    },
    {
      key: 'image',
      header: 'Image',
      render: (slide) => (
        <img
          src={slide.image}
          alt={slide.title}
          className="w-24 h-14 rounded object-cover"
        />
      ),
    },
    { key: 'title', header: 'Title' },
    { key: 'cta_text', header: 'CTA' },
    {
      key: 'active',
      header: 'Status',
      render: (slide) => (
        <span className={cn(
          "px-2 py-1 rounded text-xs",
          slide.active
            ? "bg-teal/20 text-teal"
            : "bg-muted text-muted-foreground"
        )}>
          {slide.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Hero Slides</h1>
        <Button variant="gold" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={slides}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? 'Edit Slide' : 'Add New Slide'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Background Image *</Label>
              <FileUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                folder="hero-slides"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">Video URL (optional)</Label>
              <Input
                id="video"
                value={formData.video}
                onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta_text">CTA Button Text</Label>
                <Input
                  id="cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Learn More"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_link">CTA Button Link</Label>
                <Input
                  id="cta_link"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="/who-we-are"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-2 mt-8">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Slide'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
