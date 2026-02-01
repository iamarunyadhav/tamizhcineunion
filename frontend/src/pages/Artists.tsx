import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArtistCard } from '@/components/ui/CinematicCard';
import { ArtistCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useArtists, useArtistCategories } from '@/api/hooks';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Artists() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data: categories } = useArtistCategories();
  const { data, isLoading } = useArtists({ search, category, page, pageSize: 12 });

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
              Our Artists
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the talented individuals who make up our creative community
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
                placeholder="Search artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={category === '' ? 'gold' : 'outline'}
                size="sm"
                onClick={() => setCategory('')}
              >
                All
              </Button>
              {categories?.map((cat) => (
                <Button
                  key={cat.id}
                  variant={category === cat.slug ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat.slug)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-16">
        <div className="section-container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${search}-${category}-${page}`}
          >
            {isLoading ? (
              Array(12).fill(0).map((_, i) => (
                <ArtistCardSkeleton key={i} />
              ))
            ) : data?.data?.length ? (
              data.data.map((artist) => (
                <motion.div key={artist.id} variants={itemVariants}>
                  <ArtistCard
                    name={artist.name}
                    photo={artist.photo}
                    category={artist.category?.name || 'Uncategorized'}
                    location={artist.location}
                    slug={artist.slug}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No artists found matching your criteria</p>
                <Button variant="gold-outline" className="mt-4" onClick={() => { setSearch(''); setCategory(''); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </motion.div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
