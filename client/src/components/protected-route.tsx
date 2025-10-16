import { useEffect, useState } from 'react';
import { Redirect } from 'wouter';
import { useToast } from '../hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        toast({
          title: 'Error',
          description: 'Failed to verify authentication',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to={adminOnly ? "/auth/admin-login" : "/auth"} />;
  }

  if (adminOnly && !user.isAdmin) {
    toast({
      title: 'Access Denied',
      description: 'You need admin privileges to access this page',
      variant: 'destructive',
    });
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}