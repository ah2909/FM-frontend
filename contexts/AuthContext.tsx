import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { setAccessToken } from '@/lib/token-store';

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      
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
    refreshUser();
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
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/logout`, {
        credentials: 'include'
      });
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the context
export function useAuth() {
  return useContext(AuthContext);
}