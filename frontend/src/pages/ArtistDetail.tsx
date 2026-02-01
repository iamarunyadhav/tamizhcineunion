import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useArtist } from '@/api/hooks';
import { useEffect, useMemo, useState } from 'react';

export default function ArtistDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: artist, isLoading } = useArtist(slug || '');
  const [coverIndex, setCoverIndex] = useState(0);

  const coverPhotos = useMemo(
    () => (artist?.gallery || []).filter((item) => item.type === 'photo' && item.is_cover_candidate !== false),
    [artist]
  );

  useEffect(() => {
    if (!coverPhotos.length) return;
    const timer = setInterval(() => {
      setCoverIndex((prev) => (prev + 1) % coverPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [coverPhotos.length]);

  const activeCover = useMemo(() => {
    const candidate = coverPhotos[coverIndex] || coverPhotos[0];
    return candidate ?? {
      url: artist?.coverImage || artist?.photo,
      focal_point: { x: 0.5, y: 0.5 },
    };
  }, [coverPhotos, coverIndex, artist]);

  if (isLoading) {
    return (
      <PageShell>
        <div className="pt-32 pb-24">
          <div className="section-container">
            <Skeleton className="w-full h-64 mb-8" />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (!artist) {
    return (
      <PageShell>
        <div className="pt-32 pb-24 text-center">
          <div className="section-container">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">Artist Not Found</h1>
            <Button variant="gold" asChild>
              <Link to="/artists">Back to Artists</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Hero Cover */}
      <section className="relative pt-20 h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${activeCover?.url || artist.coverImage || artist.photo})`,
            backgroundPosition: `${((activeCover?.focal_point?.x ?? 0.5) * 100).toFixed(1)}% ${((activeCover?.focal_point?.y ?? 0.5) * 100).toFixed(1)}%`,
            transition: 'background-image 0.6s ease, background-position 0.6s ease',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        
        <div className="section-container relative z-10 h-full flex items-end pb-8">
          <Button variant="ghost" size="sm" asChild className="absolute top-8 left-4">
            <Link to="/artists">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Artists
            </Link>
          </Button>

          {coverPhotos.length > 1 && (
            <div className="flex gap-2 absolute bottom-6 right-6 bg-background/60 backdrop-blur-sm px-3 py-2 rounded-full shadow-elevated">
              {coverPhotos.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCoverIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === coverIndex ? 'bg-primary w-5' : 'bg-muted-foreground/60'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Artist Info */}
      <section className="relative z-10 -mt-24">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-background shadow-elevated shrink-0"
            >
              <img 
                src={artist.photo} 
                alt={artist.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <Badge variant="gold" className="mb-3">
                {artist.category?.parent?.name ? `${artist.category.parent.name} · ${artist.category.name}` : (artist.category?.name || 'Uncategorized')}
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
                {artist.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="w-4 h-4" />
                <span>{artist.location || 'Location not specified'}</span>
              </div>

              {/* Social Links */}
              {artist.socialLinks && (
                <div className="flex gap-3 mb-6">
                  {artist.socialLinks.facebook && (
                    <a href={artist.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks.instagram && (
                    <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {artist.socialLinks.youtube && (
                    <a href={artist.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio & Skills */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Bio */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">About</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {artist.bio}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {(artist.skills || []).map((skill, idx) => (
                  <Badge key={idx} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-card">
        <div className="section-container">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-gradient mb-1">Gallery</h2>
                <p className="text-muted-foreground">Image and video highlights from {artist.name}</p>
              </div>
              <Button variant="gold" asChild>
                <Link to="/media">View Full Media Unit</Link>
              </Button>
            </div>

            {/* Photo grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(artist.gallery || [])
                .filter((item) => item.type === 'photo')
                .map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl overflow-hidden bg-background/40 border border-border/60 shadow-sm"
                    style={{
                      aspectRatio: '4 / 3',
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.title || artist.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        objectPosition: `${((item.focal_point?.x ?? 0.5) * 100).toFixed(1)}% ${((item.focal_point?.y ?? 0.5) * 100).toFixed(1)}%`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.title && (
                      <div className="absolute bottom-3 left-3 right-3 text-white text-sm font-medium drop-shadow">
                        {item.title}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Videos */}
            {(artist.gallery || []).some((i) => i.type === 'video') && (
              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-foreground">Video Gallery</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(artist.gallery || [])
                    .filter((item) => item.type === 'video')
                    .map((item) => (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl overflow-hidden border border-border/60 bg-background/40 hover:border-primary/50 transition-colors"
                      >
                        <div className="relative aspect-video bg-muted">
                          <img
                            src={item.thumbnail || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'}
                            alt={item.title || 'Video thumbnail'}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
                            ▶
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-foreground">{item.title || 'Watch video'}</p>
                          <p className="text-sm text-muted-foreground truncate">{item.url}</p>
                        </div>
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
