import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Who We Are', href: '/who-we-are' },
  { label: 'Artists', href: '/artists' },
  { label: 'Projects', href: '/projects' },
  { label: 'Media Unit', href: '/media' },
  { label: 'Latest News', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg" 
            : "bg-transparent"
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center group-hover:shadow-glow transition-shadow">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-xl font-bold text-gradient">TAMIZHCINEUNION</span>
                <p className="text-xs text-muted-foreground">Voice of the Hills</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors relative",
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="gold-outline" size="sm" asChild>
                <Link to="/artists">Explore Artists</Link>
              </Button>
              <Button variant="gold" size="sm" asChild>
                <Link to="/membership">Join Community</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-xl font-bold text-gradient">Menu</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-foreground hover:text-primary"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-lg font-medium transition-colors",
                          location.pathname === item.href
                            ? "bg-primary/20 text-primary"
                            : "text-foreground hover:bg-secondary"
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-8 space-y-3">
                  <Button variant="gold" className="w-full" asChild>
                    <Link to="/membership" onClick={() => setIsMenuOpen(false)}>
                      Join Community
                    </Link>
                  </Button>
                  <Button variant="gold-outline" className="w-full" asChild>
                    <Link to="/artists" onClick={() => setIsMenuOpen(false)}>
                      Explore Artists
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
