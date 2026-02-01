import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { PostCard } from '@/components/ui/CinematicCard';
import { PostCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePosts } from '@/api/hooks';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const categories = ['All', 'Awards', 'Announcements', 'Events', 'Workshops', 'Theatre', 'Artist Spotlight'];

export default function Blog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePosts({ 
    search, 
    category: category === 'All' ? '' : category, 
    page, 
    pageSize: 9 
  });

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-4">
              Latest News
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with our community's achievements, events, and announcements
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card sticky top-20 z-30 border-b border-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat || (cat === 'All' && category === '') ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat === 'All' ? '' : cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="section-container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${search}-${category}-${page}`}
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            ) : data?.data?.length ? (
              data.data.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <PostCard
                    title={post.title}
                    excerpt={post.excerpt}
                    coverImage={post.coverImage}
                    category={post.category}
                    date={post.publishedAt}
                    slug={post.slug}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No articles found</p>
                <Button variant="gold-outline" className="mt-4" onClick={() => { setSearch(''); setCategory(''); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Previous
              </Button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <Button key={i + 1} variant={page === i + 1 ? 'gold' : 'outline'} size="sm" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
