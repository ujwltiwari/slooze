'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client/react';
import { ME_QUERY, LOGIN_MUTATION } from '@/lib/graphql';

export type Role = 'ADMIN' | 'MANAGER' | 'MEMBER';
export type Country = 'INDIA' | 'AMERICA';

type User = { id: number; email: string; role: Role; country: Country; name: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  const [user, setUser] = useState<User | null>(null);
  
  
  const { data:meData, loading: queryLoading, error: meError, refetch } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore', 
    fetchPolicy: 'network-only' 
  });

  useEffect(() => {
    if ((meData as any)?.me) {
      setUser((meData as any).me);
    }
    if (meError) {
      setUser(null);
    }
  }, [meData, meError]);

  const [loginMutation] = useMutation(LOGIN_MUTATION);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({ variables: { email, password } });
      if ((data as any)?.login) {
        localStorage.setItem('token', (data as any).login.token);
        setUser((data as any).login.user);
        await client.resetStore(); 
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    await client.clearStore();
    client.setLink(client.link); 
    
  };

  return (
    <AuthContext.Provider value={{ user, loading: queryLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

