import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { adminPosts } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { FileUpload } from '@/components/admin/FileUpload';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[] | null;
  author: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function PostsAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: '',
    tags: '',
    author: '',
    featured: false,
    published: false,
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-posts', search],
    queryFn: async () => {
      const data = await adminPosts.list({ search, published: undefined });
      return data as Post[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const postData = {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        excerpt: data.excerpt || null,
        content: data.content || null,
        cover_image: data.cover_image || null,
        category: data.category || null,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : null,
        author: data.author || null,
        featured: data.featured,
        published: data.published,
        published_at: data.published ? new Date().toISOString() : null,
      };

      if (data.id) {
        await adminPosts.update(editingPost?.slug || data.slug || data.id, postData);
      } else {
        await adminPosts.create(postData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(editingPost ? 'Post updated!' : 'Post created!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (slug: string) => adminPosts.remove(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      toast.success('Post deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image: '',
      category: '',
      tags: '',
      author: '',
      featured: false,
      published: false,
    });
    setEditingPost(null);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.cover_image || '',
      category: post.category || '',
      tags: post.tags?.join(', ') || '',
      author: post.author || '',
      featured: post.featured,
      published: post.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (post: Post) => {
    if (confirm(`Delete post "${post.title}"?`)) {
      deleteMutation.mutate(post.slug);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      ...formData,
      id: editingPost?.id,
    });
  };

  const columns: Column<Post>[] = [
    {
      key: 'cover_image',
      header: 'Cover',
      render: (post) => (
        <img
          src={post.cover_image || '/placeholder.svg'}
          alt={post.title}
          className="w-16 h-10 rounded object-cover"
        />
      ),
    },
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    {
      key: 'published',
      header: 'Status',
      render: (post) => (
        <span className={cn(
          "px-2 py-1 rounded text-xs",
          post.published
            ? "bg-teal/20 text-teal"
            : "bg-muted text-muted-foreground"
        )}>
          {post.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (post) => format(new Date(post.created_at), 'MMM d, yyyy'),
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-display font-bold">Blog Posts</h1>
        <Button variant="gold" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <DataTable
        columns={columns}
        data={posts}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Post' : 'Create New Post'}
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="News, Events, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <FileUpload
                value={formData.cover_image}
                onChange={(url) => setFormData({ ...formData, cover_image: url })}
                folder="posts"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Brief summary of the post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                placeholder="Write your post content here..."
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="news, event, festival"
              />
            </div>

            <div className="flex gap-6">
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="published">Publish</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
