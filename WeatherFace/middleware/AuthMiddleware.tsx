import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.replace('/auth');
    }
  }, [state.isAuthenticated, router]);

  return <>{children}</>;
};

export default AuthMiddleware;
