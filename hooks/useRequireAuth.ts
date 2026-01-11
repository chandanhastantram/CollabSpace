"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Loading } from '@/components/ui/loading';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return { user: null, loading: true };
  }

  return { user, loading: false };
}

export function useRequireRole(requiredRole: string | string[]) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role)) {
          router.push('/');
        }
      }
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return { user: null, loading: true };
  }

  return { user, loading: false };
}
