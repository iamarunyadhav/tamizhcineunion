import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ReactPlayer from 'react-player';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';

interface VideoPlayerModalProps {
  video: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ video, isOpen, onClose }: VideoPlayerModalProps) {
  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && video && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-5xl mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                "absolute -top-12 right-0 p-2 rounded-full",
                "bg-secondary/80 hover:bg-secondary text-foreground",
                "transition-colors duration-200 z-20"
              )}
              aria-label="Close video player"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Container */}
            <div className="glass-card overflow-hidden">
              <div className="aspect-video bg-black">
                <ReactPlayer
                  src={video.url}
                  style={{ width: '100%', height: '100%' }}
                  controls
                  autoPlay
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-3">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  {video.duration && (
                    <span className="flex items-center gap-1">
                      Duration: {video.duration}
                    </span>
                  )}
                  <span className="capitalize">{video.category?.name}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
