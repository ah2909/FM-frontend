"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';
import Loading from './Loading';

function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) return ( <Loading /> );
  // Don’t render content if authenticated (redirect will happen)
  if (isAuthenticated) return null;

  return children;
}

export default GuestRoute;