import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/api/client';

interface AuthUser {
  id: string | number;
  email: string;
  name?: string;
  is_admin?: boolean;
  is_member?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  isMember: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = (authToken: string, authUser: AuthUser) => {
    localStorage.setItem('auth_token', authToken);
    setToken(authToken);
    setUser(authUser);
    setIsAdmin(Boolean(authUser.is_admin));
    setIsMember(Boolean(authUser.is_member));
  };

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.get('/auth/me');
        persistAuth(storedToken, data);
      } catch (err) {
        console.error('Auth bootstrap failed', err);
        localStorage.removeItem('auth_token');
        setUser(null);
        setToken(null);
        setIsAdmin(false);
        setIsMember(false);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    persistAuth(data.token, data.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { data } = await apiClient.post('/auth/register', { name, email, password });
    persistAuth(data.token, data.user);
  };

  const signOut = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
      setIsAdmin(false);
      setIsMember(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isMember, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
