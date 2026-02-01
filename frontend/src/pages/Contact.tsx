import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitContact } from '@/api/hooks';
import { useToast } from '@/hooks/use-toast';
import { siteSettings } from '@/api/mockData';

export default function Contact() {
  const { mutate: submit, isPending } = useSubmitContact();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(form, { onSuccess: () => { setSubmitted(true); toast({ title: 'Message Sent!', description: 'We will get back to you soon.' }); } });
  };

  return (
    <PageShell>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20" />
        <div className="section-container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Have questions? We'd love to hear from you. Get in touch with our team.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><MapPin className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Our Location</h3><p className="text-muted-foreground">{siteSettings.address}</p></div>
                </div>
                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Phone className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Phone</h3>{siteSettings.phone.map((p) => (<a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="block text-muted-foreground hover:text-primary">{p}</a>))}</div>
                </div>
                <div className="glass-card p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><Mail className="w-6 h-6 text-primary" /></div>
                  <div><h3 className="font-semibold text-foreground mb-1">Email</h3><a href={`mailto:${siteSettings.email}`} className="text-muted-foreground hover:text-primary">{siteSettings.email}</a></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center"><CheckCircle className="w-10 h-10 text-primary" /></div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">We'll get back to you as soon as possible.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Send a Message</h2>
                  <div><label className="block text-sm font-medium text-foreground mb-2">Name *</label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="bg-secondary" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-foreground mb-2">Email *</label><Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="bg-secondary" /></div>
                    <div><label className="block text-sm font-medium text-foreground mb-2">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 XX XXX XXXX" className="bg-secondary" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-foreground mb-2">Message *</label><Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className="bg-secondary min-h-[150px]" /></div>
                  <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isPending}><Send className="w-4 h-4 mr-2" />{isPending ? 'Sending...' : 'Send Message'}</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
