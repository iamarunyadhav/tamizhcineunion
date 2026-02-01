import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Users, Palette, Film, Music, BookOpen } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { useAboutContent } from '@/api/hooks';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const connectIcons = [Users, Palette, Film, Music, BookOpen, Users, Heart];

export default function WhoWeAre() {
  const { data: content } = useAboutContent();

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        
        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-6">
              Who We Are
            </h1>
            <p className="text-xl text-muted-foreground">
              {content?.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-card">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Purpose
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {content?.purpose}
              </p>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                We Connect:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {content?.connects?.map((item, index) => {
                  const Icon = connectIcons[index] || Users;
                  return (
                    <motion.div
                      key={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={itemVariants}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" 
                  alt="Our Community" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-xl overflow-hidden border-4 border-background shadow-elevated">
                <img 
                  src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80" 
                  alt="Filmmaking" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-10"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content?.vision}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card p-10"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <ul className="space-y-4">
                {content?.mission?.map((item, index) => (
                  <motion.li
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs text-primary font-bold">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Belief */}
      <section className="py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-background/95" />
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        
        <motion.div 
          className="section-container relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Heart className="w-16 h-16 mx-auto text-primary mb-8" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Our Belief
          </h2>
          <blockquote className="text-2xl md:text-4xl font-display text-gradient italic max-w-4xl mx-auto leading-relaxed">
            "{content?.belief}"
          </blockquote>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-card">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-6">
              Ready to Join Our Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Whether you're a seasoned professional or an aspiring artist, there's a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link to="/membership">Become a Member</Link>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
