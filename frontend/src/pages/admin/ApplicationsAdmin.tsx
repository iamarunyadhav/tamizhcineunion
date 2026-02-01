import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMemberships, adminMembers } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, Column } from '@/components/admin/DataTable';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  date_of_birth?: string | null;
  location: string | null;
  category: string | null;
  skills: string[] | null;
  bio: string | null;
  portfolio_links: string[] | null;
  profile_photo: string | null;
  status: string;
  created_at: string;
}

export default function ApplicationsAdmin() {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [memberPassword, setMemberPassword] = useState('');
  const [isCreatingMember, setIsCreatingMember] = useState(false);

  useEffect(() => {
    if (!selectedApp) {
      setMemberPassword('');
    }
  }, [selectedApp]);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const data = await adminMemberships.list();
      return data as Application[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      adminMemberships.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminMemberships.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast.success('Application deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (app: Application) => {
    if (confirm(`Delete application from "${app.name}"?`)) {
      deleteMutation.mutate(app.id);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-10);
    setMemberPassword(password);
    return password;
  };

  const handleCreateMember = async () => {
    if (!selectedApp) return;
    const password = memberPassword || generatePassword();
    setIsCreatingMember(true);
    try {
      await adminMembers.create({
        application_id: selectedApp.id,
        password,
      });
      toast.success(`Member account created. Temporary password: ${password}`);
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      setMemberPassword('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create member account.');
    } finally {
      setIsCreatingMember(false);
    }
  };

  const columns: Column<Application>[] = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'category', header: 'Category' },
    {
      key: 'status',
      header: 'Status',
      render: (app) => (
        <span className={cn(
          "px-2 py-1 rounded text-xs capitalize",
          app.status === 'approved' && "bg-teal/20 text-teal",
          app.status === 'pending' && "bg-primary/20 text-primary",
          app.status === 'rejected' && "bg-destructive/20 text-destructive",
        )}>
          {app.status}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (app) => format(new Date(app.created_at), 'MMM d, yyyy'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Membership Applications</h1>

      <DataTable
        columns={columns}
        data={applications}
        isLoading={isLoading}
        onView={(app) => setSelectedApp(app)}
        onDelete={handleDelete}
      />

      {/* View Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {selectedApp.profile_photo && (
                  <img
                    src={selectedApp.profile_photo}
                    alt={selectedApp.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedApp.name}</h3>
                  <p className="text-muted-foreground">{selectedApp.email}</p>
                  <p className="text-muted-foreground">{selectedApp.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{selectedApp.location || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedApp.category || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{selectedApp.date_of_birth || '-'}</p>
                </div>
              </div>

              {selectedApp.skills && selectedApp.skills.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-secondary rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.bio && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bio</p>
                  <p className="text-sm">{selectedApp.bio}</p>
                </div>
              )}

              {selectedApp.portfolio_links && selectedApp.portfolio_links.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Portfolio Links</p>
                  <div className="space-y-1">
                    {selectedApp.portfolio_links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:underline text-sm"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant={selectedApp.status === 'approved' ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  variant={selectedApp.status === 'pending' ? 'gold' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedApp.id, 'pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={selectedApp.status === 'rejected' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                >
                  Reject
                </Button>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="font-semibold">Create Member Account</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    placeholder="Set temporary password"
                  />
                  <Button type="button" variant="outline" onClick={generatePassword}>
                    Generate
                  </Button>
                  <Button type="button" variant="gold" onClick={handleCreateMember} disabled={isCreatingMember}>
                    {isCreatingMember ? 'Creating...' : 'Create Account'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share the temporary password with the member so they can log in and update their profile.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
