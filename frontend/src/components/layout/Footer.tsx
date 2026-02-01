import { Link } from 'react-router-dom';
import { Film, MapPin, Phone, Mail, Facebook, Youtube, Instagram } from 'lucide-react';
import { siteSettings } from '@/api/mockData';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-gradient">TAMIZHCINEUNION</span>
                <p className="text-xs text-muted-foreground">{siteSettings.tagline}</p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A creative collective dedicated to uplifting and showcasing the artistic talents 
              of the hill country Tamil community in Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Who We Are', 'Artists', 'Projects', 'Media Unit', 'Latest News'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Get Involved</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/membership"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Become a Member
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Collaborate on Projects
                </Link>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Support Our Mission
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{siteSettings.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <div className="space-y-1">
                  {siteSettings.phone.map((num) => (
                    <a 
                      key={num}
                      href={`tel:${num.replace(/\s/g, '')}`}
                      className="block text-muted-foreground hover:text-primary text-sm transition-colors"
                    >
                      {num}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a 
                  href={`mailto:${siteSettings.email}`}
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {siteSettings.email}
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {siteSettings.socialLinks.facebook && (
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialLinks.youtube && (
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialLinks.instagram && (
                <a
                  href={siteSettings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} TAMIZHCINEUNION. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
