import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Play, Image, Music, FileText } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { MediaCard } from '@/components/ui/CinematicCard';
import { VideoPlayerModal } from '@/components/ui/VideoPlayerModal';
import { PhotoLightbox } from '@/components/ui/PhotoLightbox';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMedia } from '@/api/hooks';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'video', label: 'Videos', icon: Play },
  { id: 'photo', label: 'Photos', icon: Image },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'document', label: 'Documents', icon: FileText },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function MediaUnit() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('type') || 'video';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  // Video modal state
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  // Photo lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data, isLoading } = useMedia({ type: activeTab, search, page, pageSize: 12 });

  const handleTabChange = (tabId: string) => {
    setSearchParams({ type: tabId });
    setPage(1);
  };

  const handleVideoClick = (item: MediaItem) => {
    setSelectedVideo(item);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Get photos for lightbox
  const photos = activeTab === 'photo' && data?.data ? data.data : [];

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
              Media Unit
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch, listen, and explore our multimedia content
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-card sticky top-20 z-30 border-b border-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Tab Buttons */}
            <div className="flex gap-2 bg-secondary/50 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Media Grid */}
      <section className="py-16">
        <div className="section-container">
          {activeTab === 'photo' ? (
            <div
              className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
              key={`${activeTab}-${search}-${page}`}
            >
              {isLoading
                ? Array(9).fill(0).map((_, i) => <CardSkeleton key={i} />)
                : data?.data?.length
                  ? data.data.map((item, index) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        className="break-inside-avoid"
                      >
                        <MediaCard
                          title={item.title}
                          thumbnail={item.thumbnail}
                          type={item.type}
                          duration={item.duration}
                          slug={item.slug}
                          onClick={() => handlePhotoClick(index)}
                        />
                      </motion.div>
                    ))
                  : (
                    <div className="col-span-full text-center py-16">
                      <p className="text-muted-foreground text-lg">No photos found</p>
                      <Button variant="gold-outline" className="mt-4" onClick={() => setSearch('')}>
                        Clear Search
                      </Button>
                    </div>
                  )}
            </div>
          ) : (
            <motion.div
              className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`${activeTab}-${search}-${page}`}
            >
              {isLoading ? (
                Array(9).fill(0).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              ) : data?.data?.length ? (
                data.data.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <MediaCard
                      title={item.title}
                      thumbnail={item.thumbnail}
                      type={item.type}
                      duration={item.duration}
                      slug={item.slug}
                      onClick={item.type === 'video' ? () => handleVideoClick(item) : undefined}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-muted-foreground text-lg">No {activeTab}s found</p>
                  <Button variant="gold-outline" className="mt-4" onClick={() => setSearch('')}>
                    Clear Search
                  </Button>
                </div>
              )}
            </motion.div>
          )}

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

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
      />

      {/* Photo Lightbox */}
      <PhotoLightbox
        photos={photos}
        isOpen={isLightboxOpen}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
      />
    </PageShell>
  );
}
