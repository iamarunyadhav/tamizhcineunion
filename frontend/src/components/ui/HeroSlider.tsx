import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import type { HeroSlide } from '@/types';

// Default fallback slides when database is empty
const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    title: 'Voice of the Hills',
    subtitle: 'Empowering hill country Tamil artists to share their stories with the world',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80',
    ctaText: 'Explore Our Vision',
    ctaLink: '/who-we-are',
  },
  {
    id: '2',
    title: 'Vision of the Screen',
    subtitle: 'A creative hub connecting filmmakers, musicians, and performing artists',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80',
    ctaText: 'Meet Our Artists',
    ctaLink: '/artists',
  },
  {
    id: '3',
    title: 'Stories That Matter',
    subtitle: 'Documenting the rich cultural heritage of our community through cinema',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80',
    ctaText: 'View Projects',
    ctaLink: '/projects',
  },
];

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export function HeroSlider({ slides: propSlides, autoPlayInterval = 6000 }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Use default slides if no slides provided - memoized to prevent hook dependency issues
  const slides = useMemo(() => {
    if (Array.isArray(propSlides) && propSlides.length > 0) {
      return propSlides.map((slide, index) => {
        const fallback = defaultSlides[index % defaultSlides.length];
        return {
          ...fallback,
          ...slide,
          title: slide.title || fallback.title,
          subtitle: slide.subtitle || fallback.subtitle,
          image: slide.image || fallback.image,
          ctaText: slide.ctaText || fallback.ctaText,
          ctaLink: slide.ctaLink || fallback.ctaLink,
        };
      });
    }

    return defaultSlides;
  }, [propSlides]);

  const slidesLength = slides.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slidesLength);
  }, [slidesLength]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slidesLength) % slidesLength);
  }, [slidesLength]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval]);

  const currentSlide = slides[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          
          {/* Gold Glow Effect */}
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="section-container">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.h1 
              className="hero-title text-gradient"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {currentSlide.title}
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl md:text-2xl text-foreground/80 font-light max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {currentSlide.subtitle}
            </motion.p>

            {currentSlide.ctaText && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-10 flex gap-4"
              >
                <Button variant="hero" size="xl" asChild>
                  <a href={currentSlide.ctaLink}>{currentSlide.ctaText}</a>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <a href="/artists">Meet Our Artists</a>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/30 backdrop-blur-sm border border-border hover:bg-background/50 hover:border-gold/50 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/30 backdrop-blur-sm border border-border hover:bg-background/50 hover:border-gold/50 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-primary w-10" 
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
}
