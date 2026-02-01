import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface CinematicCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function CinematicCard({ 
  children, 
  className, 
  href,
  onClick,
  hoverable = true 
}: CinematicCardProps) {
  const cardContent = (
    <motion.div
      className={cn(
        "glass-card relative overflow-hidden transition-all duration-500",
        hoverable && "hover:border-gold/30 gold-glow-hover cursor-pointer",
        className
      )}
      whileHover={hoverable ? { y: -5, scale: 1.02 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return <Link to={href}>{cardContent}</Link>;
  }

  return cardContent;
}

interface ArtistCardProps {
  name: string;
  photo: string;
  category: string;
  location: string;
  slug: string;
}

export function ArtistCard({ name, photo, category, location, slug }: ArtistCardProps) {
  return (
    <CinematicCard href={`/artists/${slug}`}>
      <div className="img-zoom aspect-square">
        <img 
          src={photo} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-primary">{category}</p>
        <p className="text-xs text-muted-foreground mt-1">{location}</p>
      </div>
    </CinematicCard>
  );
}

interface ProjectCardProps {
  title: string;
  thumbnail: string;
  type: string;
  status: string;
  slug: string;
}

export function ProjectCard({ title, thumbnail, type, status, slug }: ProjectCardProps) {
  return (
    <CinematicCard href={`/projects/${slug}`}>
      <div className="img-zoom aspect-video">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute top-4 left-4 flex gap-2">
        <span className={cn(
          "px-2 py-1 text-xs rounded-full capitalize",
          type === 'film' && "bg-gold/80 text-primary-foreground",
          type === 'music' && "bg-teal/80 text-white",
          type === 'theatre' && "bg-burgundy/80 text-white",
          type === 'visual' && "bg-accent/80 text-accent-foreground",
          type === 'documentary' && "bg-muted text-muted-foreground"
        )}>
          {type}
        </span>
        <span className={cn(
          "px-2 py-1 text-xs rounded-full capitalize",
          status === 'completed' && "bg-teal/80 text-white",
          status === 'ongoing' && "bg-gold/80 text-primary-foreground",
          status === 'upcoming' && "bg-muted text-muted-foreground"
        )}>
          {status}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      </div>
    </CinematicCard>
  );
}

interface MediaCardProps {
  title: string;
  thumbnail: string;
  type: 'video' | 'photo' | 'audio' | 'document';
  duration?: string;
  slug: string;
  onClick?: () => void;
}

export function MediaCard({ title, thumbnail, type, duration, slug, onClick }: MediaCardProps) {
  // For videos/photos with onClick, don't use href - handle click instead
  const cardProps = onClick 
    ? { onClick, hoverable: true }
    : { href: `/media/${type}s/${slug}` };

  return (
    <CinematicCard {...cardProps}>
      <div className="img-zoom aspect-video relative">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-foreground border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-background/80 rounded">
            {duration}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2">{title}</h3>
      </div>
    </CinematicCard>
  );
}

interface PostCardProps {
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
  slug: string;
}

export function PostCard({ title, excerpt, coverImage, category, date, slug }: PostCardProps) {
  return (
    <CinematicCard href={`/blog/${slug}`}>
      <div className="img-zoom aspect-video">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <span className="text-xs text-primary uppercase tracking-wider">{category}</span>
        <h3 className="font-display text-xl font-semibold text-foreground mt-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm line-clamp-2">{excerpt}</p>
        <p className="text-xs text-muted-foreground mt-4">{date}</p>
      </div>
    </CinematicCard>
  );
}
