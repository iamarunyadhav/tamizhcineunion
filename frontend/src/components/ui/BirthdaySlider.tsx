import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cake, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface BirthdayPerson {
  id: string;
  name: string;
  photo?: string | null;
  type: 'artist' | 'member';
  slug?: string;
  date_of_birth?: string;
}

const CakeStack = () => (
  <div className="relative w-40 h-40 mx-auto">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-10 rounded-b-2xl bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 shadow-lg" />
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-10 rounded-b-2xl bg-gradient-to-r from-pink-200 via-rose-300 to-pink-200 shadow-lg" />
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-28 h-10 rounded-b-2xl bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-200 shadow-lg" />
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-2 h-10 bg-amber-100 rounded-full shadow-md" />
    <motion.div
      className="absolute bottom-32 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-b from-yellow-200 via-orange-400 to-red-500 blur-[1px]"
      animate={{ scale: [0.9, 1.1, 0.95], y: [0, -4, 0] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    />
  </div>
);

export function BirthdaySlider({ items }: { items: BirthdayPerson[] }) {
  const [selected, setSelected] = useState<BirthdayPerson | null>(null);

  if (!items.length) return null;

  return (
    <section className="py-10 bg-card/60 border-y border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Today&apos;s birthday celebrations
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient">
              Birthday Wishes
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cake className="w-4 h-4 text-primary" />
            {items.length} celebration{items.length > 1 ? 's' : ''} today
          </div>
        </div>

        <Carousel
          opts={{ align: 'start', loop: items.length > 3 }}
          className="relative"
        >
          <CarouselContent>
            {items.map((person) => (
              <CarouselItem key={person.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="glass-card p-5 h-full flex flex-col justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={person.photo || '/placeholder.svg'}
                        alt={person.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
                      />
                      <motion.div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <Star className="w-3 h-3" />
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{person.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{person.type}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Button variant="gold-outline" size="sm" onClick={() => setSelected(person)}>
                      Wish Happy Birthday
                    </Button>
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-gradient">
              Happy Birthday
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src={selected.photo || '/placeholder.svg'}
                  alt={selected.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                />
                <div>
                  <p className="text-xl font-semibold">{selected.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{selected.type}</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Wishing you a joyful year filled with creativity, cinema, and unforgettable moments.
              </p>
              <CakeStack />
              <div className="flex justify-end">
                <div className="flex flex-wrap justify-end gap-3">
                  {selected.type === 'artist' && selected.slug && (
                    <Button variant="gold-outline" asChild>
                      <Link to={`/artists/${selected.slug}`}>View Profile</Link>
                    </Button>
                  )}
                  <Button variant="gold" onClick={() => setSelected(null)}>
                    Send Wishes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
