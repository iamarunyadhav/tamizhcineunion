import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { ProjectCard } from '@/components/ui/CinematicCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/api/hooks';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const projectTypes = [
  { value: '', label: 'All Types' },
  { value: 'film', label: 'Film' },
  { value: 'theatre', label: 'Theatre' },
  { value: 'music', label: 'Music' },
  { value: 'visual', label: 'Visual Arts' },
  { value: 'documentary', label: 'Documentary' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
];

export default function Projects() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useProjects({ search, type, status, page, pageSize: 8 });

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
              Our Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our creative productions across film, theatre, music, and visual arts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card sticky top-20 z-30 border-b border-border">
        <div className="section-container">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((t) => (
                  <Button
                    key={t.value}
                    variant={type === t.value ? 'gold' : 'outline'}
                    size="sm"
                    onClick={() => setType(t.value)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((s) => (
                  <Button
                    key={s.value}
                    variant={status === s.value ? 'gold' : 'outline'}
                    size="sm"
                    onClick={() => setStatus(s.value)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="section-container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${search}-${type}-${status}-${page}`}
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : data?.data?.length ? (
              data.data.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard
                    title={project.title}
                    thumbnail={project.thumbnail}
                    type={project.type}
                    status={project.status}
                    slug={project.slug}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg">No projects found matching your criteria</p>
                <Button variant="gold-outline" className="mt-4" onClick={() => { setSearch(''); setType(''); setStatus(''); }}>
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
