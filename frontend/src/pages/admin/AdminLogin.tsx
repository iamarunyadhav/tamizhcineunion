import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/api/client';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if there are any existing admins
  useEffect(() => {
    async function checkAdmins() {
      try {
        const { data } = await apiClient.get('/auth/admin-exists');
        const exists = Boolean(data?.exists);
        setHasAdmins(exists);
        if (!exists) setMode('signup');
      } catch (error) {
        console.error('Error checking admin presence:', error);
        setHasAdmins(true);
        setMode('login');
      }
    }
    checkAdmins();
  }, []);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email.split('@')[0] || email, email, password);
        toast.success('Admin account created successfully!');
        navigate('/admin');
      } else {
        await signIn(email, password);
        toast.success('Login successful!');
        navigate('/admin');
      }
    } catch (err) {
      const message = (err as any)?.response?.data?.message || (err as Error)?.message || 'An unexpected error occurred';
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-gradient mb-2">
              {mode === 'signup' ? 'Create Admin Account' : 'Admin Login'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'signup' 
                ? hasAdmins === false 
                  ? 'Set up your first admin account to get started'
                  : 'Create a new admin account'
                : 'Sign in to manage your content'
              }
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                mode === 'signup' ? 'Creating account...' : 'Signing in...'
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Admin Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Toggle between login and signup */}
          {hasAdmins !== null && (
            <div className="mt-6 text-center">
              {mode === 'login' && hasAdmins === false ? (
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Need to create an admin account?
                </button>
              ) : hasAdmins ? (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Already have an account? Sign in
                </button>
              ) : null}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
