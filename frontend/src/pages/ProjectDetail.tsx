import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useProject } from '@/api/hooks';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || '');

  if (isLoading) {
    return (
      <PageShell>
        <div className="pt-32 pb-24">
          <div className="section-container">
            <Skeleton className="w-full h-96 mb-8" />
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (!project) {
    return (
      <PageShell>
        <div className="pt-32 pb-24 text-center">
          <div className="section-container">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
            <Button variant="gold" asChild>
              <Link to="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Hero Banner */}
      <section className="relative pt-20 h-[70vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${project.bannerImage || project.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        
        <div className="section-container relative z-10 h-full flex flex-col justify-end pb-16">
          <Button variant="ghost" size="sm" asChild className="absolute top-8 left-4">
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex gap-3 mb-4">
              <Badge variant={project.type as any} className="capitalize">{project.type}</Badge>
              <Badge variant={project.status as any} className="capitalize">{project.status}</Badge>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4">
              {project.title}
            </h1>
            {project.releaseDate && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{project.releaseDate}</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Project</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>
              {project.synopsis && (
                <>
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">Synopsis</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.synopsis}</p>
                </>
              )}
            </div>

            {/* Credits */}
            {project.credits.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Credits
                </h2>
                <div className="glass-card p-6 space-y-4">
                  {project.credits.map((credit, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{credit.role}</span>
                      <Link 
                        to={`/artists/${credit.artistId}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {credit.artistName}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Media Section Placeholder */}
      <section className="py-16 bg-card">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-gradient mb-4">Project Media</h2>
          <p className="text-muted-foreground mb-8">
            Explore photos, videos, and audio from this project
          </p>
          <Button variant="gold" asChild>
            <Link to="/media">View Media Unit</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
