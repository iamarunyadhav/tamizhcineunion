import { Link, useParams } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { useMediaItem } from '@/api/hooks';
import ReactPlayer from 'react-player';
import { FileText } from 'lucide-react';

const normalizeType = (type?: string) => {
  if (!type) return 'video';
  if (type.endsWith('s')) {
    return type.slice(0, -1);
  }
  return type;
};

export default function MediaDetail() {
  const { type, slug } = useParams();
  const mediaType = normalizeType(type);
  const { data, isLoading } = useMediaItem(mediaType, slug || '');

  return (
    <PageShell>
      <section className="py-16">
        <div className="section-container">
          <SectionTitle
            title="Media Highlight"
            subtitle="Explore the full story behind this media item."
          />

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {!isLoading && !data && (
            <div className="text-center py-16 space-y-4">
              <p className="text-muted-foreground text-lg">Media item not found.</p>
              <Button variant="gold-outline" asChild>
                <Link to="/media">Back to Media Unit</Link>
              </Button>
            </div>
          )}

          {!isLoading && data && (
            <div className="glass-card overflow-hidden">
              <div className="aspect-video bg-black">
                {data.type === 'video' && (
                  <ReactPlayer
                    src={data.url}
                    style={{ width: '100%', height: '100%' }}
                    controls
                    playing
                  />
                )}
                {data.type === 'audio' && (
                  <div className="h-full flex items-center justify-center p-8">
                    <ReactPlayer src={data.url} controls width="100%" height="60px" />
                  </div>
                )}
                {data.type === 'photo' && (
                  <img
                    src={data.url || data.thumbnail}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {data.type === 'document' && (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <FileText className="w-12 h-12 text-primary" />
                    <Button variant="gold" asChild>
                      <a href={data.url} target="_blank" rel="noreferrer">
                        Open Document
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{data.type}</p>
                <h1 className="font-display text-3xl font-bold">{data.title}</h1>
                {data.description && (
                  <p className="text-muted-foreground">{data.description}</p>
                )}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {data.duration && <span>Duration: {data.duration}</span>}
                  {data.category?.name && <span>Category: {data.category.name}</span>}
                </div>

                <div className="pt-4">
                  <Button variant="gold-outline" asChild>
                    <Link to="/media">Back to Media Unit</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
