import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Camera, GraduationCap, Handshake, Image, Calendar, CheckCircle } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMembershipInfo, useSubmitMembership } from '@/api/hooks';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, React.ElementType> = { Users, Camera, GraduationCap, Handshake, Image, Calendar };

export default function Membership() {
  const { data: info } = useMembershipInfo();
  const { mutate: submit, isPending } = useSubmitMembership();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', dateOfBirth: '', location: '', category: '', skills: '', bio: '', portfolioLinks: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({
      ...form,
      skills: form.skills.split(',').map(s => s.trim()),
      portfolioLinks: form.portfolioLinks.split(',').map(s => s.trim())
    }, {
      onSuccess: () => { setSubmitted(true); toast({ title: 'Application Submitted!', description: 'We will review your application and get back to you soon.' }); }
    });
  };

  if (submitted) {
    return (
      <PageShell>
        <section className="pt-32 pb-24 min-h-screen flex items-center">
          <div className="section-container text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4">Application Submitted!</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">Thank you for your interest in joining TAMIZHCINEUNION. We'll review your application and contact you soon.</p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="section-container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-4">Join Our Community</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Become a member and unlock opportunities for growth, collaboration, and creative expression</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="section-container">
          <SectionTitle title="Member Benefits" subtitle="What you get as a TAMIZHCINEUNION member" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {info?.benefits?.map((benefit, idx) => {
              const Icon = iconMap[benefit.icon] || Users;
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="glass-card p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"><Icon className="w-7 h-7 text-primary" /></div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container max-w-2xl">
          <SectionTitle title="Apply for Membership" subtitle="Fill out the form below to start your application" />
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-2">Full Name *</label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="bg-secondary" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Phone *</label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 XX XXX XXXX" className="bg-secondary" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-2">Email *</label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="bg-secondary" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Date of Birth *</label><Input type="date" required value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="bg-secondary" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-2">Location *</label><Input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City/Town" className="bg-secondary" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-2">Category *</label><Input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g., Director, Actor, Musician" className="bg-secondary" /></div>
            </div>
            <div><label className="block text-sm font-medium text-foreground mb-2">Skills (comma-separated)</label><Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g., Acting, Screenwriting, Editing" className="bg-secondary" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-2">About You *</label><Textarea required value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself and your creative journey..." className="bg-secondary min-h-[120px]" /></div>
            <div><label className="block text-sm font-medium text-foreground mb-2">Portfolio Links (comma-separated)</label><Input value={form.portfolioLinks} onChange={(e) => setForm({ ...form, portfolioLinks: e.target.value })} placeholder="YouTube, Instagram, website URLs" className="bg-secondary" /></div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}>{isPending ? 'Submitting...' : 'Submit Application'}</Button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
