import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePost } from '@/api/hooks';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = usePost(slug || '');

  if (isLoading) {
    return (
      <PageShell>
        <div className="pt-32 pb-24"><div className="section-container"><Skeleton className="w-full h-96 mb-8" /><Skeleton className="h-10 w-3/4 mb-4" /><Skeleton className="h-4 w-full" /></div></div>
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell>
        <div className="pt-32 pb-24 text-center"><div className="section-container"><h1 className="font-display text-4xl font-bold text-foreground mb-4">Post Not Found</h1><Button variant="gold" asChild><Link to="/blog">Back to Blog</Link></Button></div></div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="relative pt-20 h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="section-container relative z-10 h-full flex flex-col justify-end pb-12">
          <Button variant="ghost" size="sm" asChild className="absolute top-8 left-4"><Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" />Back to Blog</Link></Button>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Badge variant="gold" className="mb-4">{post.category}</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-2"><User className="w-4 h-4" />{post.author}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{post.publishedAt}</span>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap"><Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map((tag) => (<Badge key={tag} variant="outline">{tag}</Badge>))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
