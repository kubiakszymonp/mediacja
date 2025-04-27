'use client';

import { useAuth } from '@/hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isAuthorized } = useAuth();

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Proszę się zalogować...</p>
      </div>
    );
  }

  return <>{children}</>;
}; 