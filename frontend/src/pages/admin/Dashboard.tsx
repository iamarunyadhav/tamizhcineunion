import { useQuery } from '@tanstack/react-query';
import { Users, Film, Image, FileText, MessageSquare, UserPlus, Play, Music } from 'lucide-react';
import { adminCounts } from '@/api/admin';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, count, icon: Icon, color }: StatCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{count}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminCounts,
  });

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Artists"
          count={stats?.artists || 0}
          icon={Users}
          color="bg-primary"
        />
        <StatCard
          title="Projects"
          count={stats?.projects || 0}
          icon={Film}
          color="bg-teal"
        />
        <StatCard
          title="Videos"
          count={stats?.videos || 0}
          icon={Play}
          color="bg-burgundy"
        />
        <StatCard
          title="Photos"
          count={stats?.photos || 0}
          icon={Image}
          color="bg-accent"
        />
        <StatCard
          title="Audio"
          count={stats?.audio || 0}
          icon={Music}
          color="bg-purple-600"
        />
        <StatCard
          title="Blog Posts"
          count={stats?.posts || 0}
          icon={FileText}
          color="bg-blue-600"
        />
        <StatCard
          title="Pending Applications"
          count={stats?.applications || 0}
          icon={UserPlus}
          color="bg-orange-500"
        />
        <StatCard
          title="Unread Messages"
          count={stats?.messages || 0}
          icon={MessageSquare}
          color="bg-pink-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/artists" className="glass-card p-4 text-center hover:border-primary/50 transition-colors">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <span className="text-sm">Add Artist</span>
          </a>
          <a href="/admin/projects" className="glass-card p-4 text-center hover:border-primary/50 transition-colors">
            <Film className="w-8 h-8 mx-auto mb-2 text-teal" />
            <span className="text-sm">Add Project</span>
          </a>
          <a href="/admin/media" className="glass-card p-4 text-center hover:border-primary/50 transition-colors">
            <Image className="w-8 h-8 mx-auto mb-2 text-burgundy" />
            <span className="text-sm">Upload Media</span>
          </a>
          <a href="/admin/posts" className="glass-card p-4 text-center hover:border-primary/50 transition-colors">
            <FileText className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <span className="text-sm">Write Post</span>
          </a>
        </div>
      </div>
    </div>
  );
}
