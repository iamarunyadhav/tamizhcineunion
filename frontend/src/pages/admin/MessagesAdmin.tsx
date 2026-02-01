import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminMessages } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/admin/DataTable';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Mail, Phone, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesAdmin() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const data = await adminMessages.list();
      return data as Message[];
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => adminMessages.update(id, { read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminMessages.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast.success('Message deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleView = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markAsReadMutation.mutate(msg.id);
    }
  };

  const handleDelete = (msg: Message) => {
    if (confirm(`Delete message from "${msg.name}"?`)) {
      deleteMutation.mutate(msg.id);
    }
  };

  const columns: Column<Message>[] = [
    {
      key: 'read',
      header: '',
      render: (msg) => (
        <div className={cn(
          "w-2 h-2 rounded-full",
          msg.read ? "bg-muted" : "bg-primary"
        )} />
      ),
    },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'message',
      header: 'Message',
      render: (msg) => (
        <span className="line-clamp-1 max-w-xs">{msg.message}</span>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (msg) => format(new Date(msg.created_at), 'MMM d, yyyy HH:mm'),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Contact Messages</h1>

      <DataTable
        columns={columns}
        data={messages}
        isLoading={isLoading}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* View Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary">
                  {selectedMessage.email}
                </a>
              </div>

              {selectedMessage.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedMessage.phone}`} className="hover:text-primary">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {format(new Date(selectedMessage.created_at), 'MMMM d, yyyy at HH:mm')}
                </p>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Reply via Email
                </Button>
                {selectedMessage.read && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                    <CheckCircle className="w-4 h-4 text-teal" />
                    Read
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
