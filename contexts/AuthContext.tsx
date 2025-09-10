import { createContext, useContext } from 'react';
import { ReactNode } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext({
  login: (token: string) => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Login function: Store the token and update state
  const login = (user: any) => {
    if (user.access_token && user.access_token !== 'undefined') {
      localStorage.setItem('token', user.access_token);
      localStorage.setItem('user_id', user.user_id);
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
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access the context
export function useAuth() {
  return useContext(AuthContext);
}