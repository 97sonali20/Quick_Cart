import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { RootState } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}