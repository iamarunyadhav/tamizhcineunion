import { useEffect } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Film,
  Image,
  FileText,
  Sliders,
  MessageSquare,
  UserPlus,
  UserCheck,
  LogOut,
  Palette,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/artists', icon: Users, label: 'Artists' },
  { path: '/admin/projects', icon: Film, label: 'Projects' },
  { path: '/admin/media', icon: Image, label: 'Media' },
  { path: '/admin/posts', icon: FileText, label: 'Blog Posts' },
  { path: '/admin/hero-slides', icon: Sliders, label: 'Hero Slides' },
  { path: '/admin/theme', icon: Palette, label: 'Theme' },
  { path: '/admin/members', icon: UserCheck, label: 'Members' },
  { path: '/admin/applications', icon: UserPlus, label: 'Applications' },
  { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
];

export default function AdminLayout() {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border p-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-gradient">TCU Admin</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border hidden lg:block">
            <h1 className="font-display text-2xl font-bold text-gradient">TCU Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Content Management</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 mt-16 lg:mt-0">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3 truncate">{user.email}</p>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-0 mt-16 lg:mt-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 lg:p-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
