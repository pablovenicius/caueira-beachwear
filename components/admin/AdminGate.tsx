'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthModal } from '@/components/AuthModal';
import { AdminPanel } from '@/components/admin/AdminPanel';
import type { Product } from '@/types/product';

/**
 * Porta de entrada do /admin: só renderiza o AdminPanel pra quem está
 * logado E cadastrado na tabela public.admins. Sem login, mostra a tela de
 * entrada (com o AuthModal). Logado mas sem cadastro em admins, mostra
 * "acesso restrito" — nunca chega a montar o painel de produtos.
 */
export function AdminGate({ initialProducts }: { initialProducts: Product[] }) {
  const { user, loading, isAdmin, adminLoading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(true);

  if (loading || (user && adminLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-tinta/60">
        Carregando…
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-24 text-center">
          <h1 className="font-display text-2xl font-normal text-tinta">Painel do lojista</h1>
          <p className="text-sm text-tinta/70">
            Essa área é restrita. Faça login com uma conta autorizada para continuar.
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="h-11 rounded-sm bg-terra px-6 text-sm font-medium uppercase tracking-widest text-white"
          >
            Entrar
          </button>
        </div>
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-normal text-tinta">Acesso restrito</h1>
        <p className="text-sm text-tinta/70">
          A conta <strong>{user.email}</strong> não tem permissão para acessar o painel do lojista. Fale com um
          administrador para liberar o acesso, ou entre com outra conta.
        </p>
        <button type="button" onClick={() => signOut()} className="text-sm text-sol-700 underline">
          Sair e entrar com outra conta
        </button>
      </div>
    );
  }

  return <AdminPanel initialProducts={initialProducts} />;
}
