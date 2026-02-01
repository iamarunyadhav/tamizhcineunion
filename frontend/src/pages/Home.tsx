import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb, Film, Globe, Users, Play } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { HeroSlider } from '@/components/ui/HeroSlider';
import { BirthdaySlider } from '@/components/ui/BirthdaySlider';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ArtistCard, ProjectCard, PostCard, MediaCard } from '@/components/ui/CinematicCard';
import { Button } from '@/components/ui/button';
import { ArtistCardSkeleton, PostCardSkeleton } from '@/components/ui/Skeleton';
import { useHome, useTodayBirthdays } from '@/api/hooks';

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Film,
  Globe,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const { data, isLoading } = useHome();
  const { data: birthdaysData } = useTodayBirthdays();
  const birthdays = Array.isArray(birthdaysData) ? birthdaysData : [];
  const featuredArtists = Array.isArray(data?.featuredArtists) ? data.featuredArtists : [];
  const featuredProjects = Array.isArray(data?.featuredProjects) ? data.featuredProjects : [];
  const featuredMedia = Array.isArray(data?.featuredMedia) ? data.featuredMedia : [];
  const programs = Array.isArray(data?.programs) ? data.programs : [];
  const latestPosts = Array.isArray(data?.latestPosts) ? data.latestPosts : [];

  return (
    <PageShell>
      {/* Hero Section */}
      <HeroSlider slides={data?.slides ?? []} />

      {/* Birthday Slider */}
      {birthdays.length > 0 && <BirthdaySlider items={birthdays} />}

      {/* Intro Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient mb-6">
              The Creative Hub of Hill Country Artists
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              TAMIZHCINEUNION is a creative collective dedicated to uplifting and showcasing the artistic talents 
              of the hill country Tamil community in Sri Lanka. We connect filmmakers, musicians, actors, writers, 
              and creative professionals – enabling collaboration, visibility, and professional growth.
            </p>
            <div className="flex justify-center gap-4 mt-10">
              <Button variant="gold" size="lg" asChild>
                <Link to="/who-we-are">
                  Discover Our Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-24 bg-card">
        <div className="section-container">
          <SectionTitle 
            title="Featured Artists" 
            subtitle="Meet the talented individuals shaping the creative landscape of our community"
          />
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {isLoading ? (
              Array(8).fill(0).map((_, i) => (
                <ArtistCardSkeleton key={i} />
              ))
            ) : (
              featuredArtists.map((artist) => (
                <motion.div key={artist.id} variants={itemVariants}>
                  <ArtistCard
                    name={artist.name}
                    photo={artist.photo}
                    category={artist.category?.name || 'Uncategorized'}
                    location={artist.location}
                    slug={artist.slug}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/artists">
                View All Artists
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="section-container">
          <SectionTitle 
            title="Featured Projects" 
            subtitle="Explore our creative productions across film, theatre, music, and visual arts"
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard
                  title={project.title}
                  thumbnail={project.thumbnail}
                  type={project.type}
                  status={project.status}
                  slug={project.slug}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/projects">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Media Highlights */}
      <section className="py-24 bg-card">
        <div className="section-container">
          <SectionTitle 
            title="Media Highlights" 
            subtitle="Watch, listen, and explore our multimedia content"
          />
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredMedia.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <MediaCard
                  title={item.title}
                  thumbnail={item.thumbnail}
                  type={item.type}
                  duration={item.duration}
                  slug={item.slug}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/media">
                Explore Media Unit
                <Play className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Programs & Initiatives */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-10" />
        <div className="section-container relative z-10">
          <SectionTitle 
            title="Programs & Initiatives" 
            subtitle="How we support and empower creative talent"
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {programs.map((program) => {
              const Icon = iconMap[program.icon] || Lightbulb;
              return (
                <motion.div 
                  key={program.id} 
                  variants={itemVariants}
                  className="glass-card p-8 text-center group hover:border-gold/30 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {program.description}
                  </p>
                  <ul className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-card">
        <div className="section-container">
          <SectionTitle 
            title="Latest News" 
            subtitle="Stay updated with our community's achievements and events"
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))
            ) : (
              latestPosts.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <PostCard
                    title={post.title}
                    excerpt={post.excerpt}
                    coverImage={post.coverImage}
                    category={post.category}
                    date={post.publishedAt}
                    slug={post.slug}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="text-center mt-12">
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/blog">
                Read All News
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-background/90" />
        <div className="absolute inset-0 bg-gradient-glow" />
        
        <motion.div 
          className="section-container relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold text-gradient mb-6">
            Join the Creative Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Be part of a movement that celebrates and elevates hill country Tamil artists. 
            Connect, collaborate, and create with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/membership">
                <Users className="w-5 h-5 mr-2" />
                Apply for Membership
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
