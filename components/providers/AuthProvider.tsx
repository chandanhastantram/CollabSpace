"use client";

import { createContext, useContext, ReactNode } from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderContent({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const isAuthenticated = !!session?.user;

  const user: User | null = session?.user
    ? {
        id: (session.user as any).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || undefined,
      }
    : null;

  // These functions are now handled by NextAuth
  // Kept for backwards compatibility with existing code
  const login = async (email: string, password: string) => {
    // This is now handled by signIn() in the login page
    throw new Error('Use signIn() from next-auth/react instead');
  };

  const logout = async () => {
    await nextAuthSignOut({ callbackUrl: '/login' });
  };

  const register = async (name: string, email: string, password: string) => {
    // This is now handled by the register page
    throw new Error('Use the register page instead');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
