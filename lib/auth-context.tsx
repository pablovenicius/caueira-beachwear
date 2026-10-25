'use client';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signOut as supabaseSignOut } from '@/lib/supabase';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** true se o usuário logado está na tabela public.admins (dono/funcionário autorizado). */
  isAdmin: boolean;
  /** true enquanto a checagem de admin ainda não terminou. */
  adminLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }
    let cancelled = false;
    setAdminLoading(true);
    supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setIsAdmin(!!data);
        setAdminLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, loading, isAdmin, adminLoading, signOut: supabaseSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/** Dá acesso ao usuário logado (ou null) em qualquer componente cliente. */
export function useAuth() {
  return useContext(AuthContext);
}
