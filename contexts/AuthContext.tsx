import { createContext, useContext, useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  login: (token: string) => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for JWT in local storage when the app loads
  useEffect(() => {
    const jwt = localStorage.getItem('token');
    setIsAuthenticated(!!jwt); // Convert to boolean: true if jwt exists, false if not
    setIsLoading(false);
  }, []);

  // Login function: Store the token and update state
  const login = (user: any) => {
    if (user.access_token && user.access_token !== 'undefined') {
      localStorage.setItem('token', user.access_token);
      localStorage.setItem('user_id', user.user_id);
      setIsAuthenticated(true);
      toast.success('Login Successful!');
    }
    else {
      toast.error('Login failed. Please try again.');
    }
  };

  // Logout function: Remove the token and update state
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the context
export function useAuth() {
  return useContext(AuthContext);
}