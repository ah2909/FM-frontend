import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { setAccessToken } from '@/lib/token-store';
import { authService } from '@/lib/services/auth';

// Prevents concurrent boot-time refresh calls (React StrictMode double-invocation,
// or navigating between route groups that each mount an AuthProvider).
let ongoingBootRefresh: Promise<void> | null = null;

interface User {
  id: number; 
  email: string;
  name: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: { access_token: string; user_id?: number }) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserInfo = async (token: string) => {
    try {
      const res = await authService.me(token);
      if (res.ok) {
        setUser(await res.json());
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser(null);
    }
  };

  const performRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await authService.refresh();
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access_token);
        await fetchUserInfo(data.access_token);
      } else {
        setAccessToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Session recovery failed:', error);
      setAccessToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ongoingBootRefresh) return;
    ongoingBootRefresh = performRefresh().finally(() => {
      ongoingBootRefresh = null;
    });
  }, []);

  const login = (data: { access_token: string }) => {
    if (data.access_token) {
      setAccessToken(data.access_token);
      fetchUserInfo(data.access_token);
      toast.success('Login Successful!');
    } else {
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser: performRefresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
