import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "./pages/Home";
import WhoWeAre from "./pages/WhoWeAre";
import Artists from "./pages/Artists";
import ArtistDetail from "./pages/ArtistDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import MediaUnit from "./pages/MediaUnit";
import MediaDetail from "./pages/MediaDetail";
import Blog from "./pages/Blog";
import PostDetail from "./pages/PostDetail";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ArtistsAdmin from "./pages/admin/ArtistsAdmin";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin";
import MediaAdmin from "./pages/admin/MediaAdmin";
import PostsAdmin from "./pages/admin/PostsAdmin";
import HeroSlidesAdmin from "./pages/admin/HeroSlidesAdmin";
import ApplicationsAdmin from "./pages/admin/ApplicationsAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";
import ThemeAdmin from "./pages/admin/ThemeAdmin";
import MembersAdmin from "./pages/admin/MembersAdmin";
import MemberLogin from "./pages/MemberLogin";
import MemberProfile from "./pages/member/MemberProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/who-we-are" element={<WhoWeAre />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:slug" element={<ArtistDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/media" element={<MediaUnit />} />
              <Route path="/media/:type/:slug" element={<MediaDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<PostDetail />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="artists" element={<ArtistsAdmin />} />
                  <Route path="projects" element={<ProjectsAdmin />} />
                  <Route path="media" element={<MediaAdmin />} />
                  <Route path="posts" element={<PostsAdmin />} />
                <Route path="hero-slides" element={<HeroSlidesAdmin />} />
                <Route path="members" element={<MembersAdmin />} />
                <Route path="applications" element={<ApplicationsAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
                <Route path="theme" element={<ThemeAdmin />} />
              </Route>

              {/* Member Routes */}
              <Route path="/member/login" element={<MemberLogin />} />
              <Route path="/member/profile" element={<MemberProfile />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
