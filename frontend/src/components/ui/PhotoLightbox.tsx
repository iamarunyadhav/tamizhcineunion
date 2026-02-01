import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Download from 'yet-another-react-lightbox/plugins/download';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { MediaItem } from '@/types';

interface PhotoLightboxProps {
  photos: MediaItem[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({ photos, isOpen, currentIndex, onClose }: PhotoLightboxProps) {
  const slides = photos.map((photo) => ({
    src: photo.url || photo.thumbnail,
    alt: photo.title,
    title: photo.title,
    description: photo.description || photo.category?.name,
    download: photo.url || photo.thumbnail,
  }));

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      index={currentIndex}
      slides={slides}
      plugins={[Thumbnails, Zoom, Counter, Captions, Download]}
      carousel={{
        finite: false,
        preload: 2,
      }}
      animation={{
        fade: 300,
        swipe: 300,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      thumbnails={{
        position: 'bottom',
        width: 100,
        height: 60,
        gap: 8,
        borderRadius: 4,
      }}
      captions={{
        showToggle: true,
        descriptionTextAlign: 'center',
        descriptionMaxLines: 3,
      }}
      styles={{
        container: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
        },
        thumbnailsContainer: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        captionsTitle: {
          fontSize: '18px',
          fontWeight: 600,
        },
        captionsDescription: {
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
        },
      }}
      render={{
        buttonPrev: slides.length <= 1 ? () => null : undefined,
        buttonNext: slides.length <= 1 ? () => null : undefined,
      }}
    />
  );
}
