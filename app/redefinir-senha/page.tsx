'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/lib/auth-context';
import { updatePassword } from '@/lib/supabase';

/**
 * Destino do link de "esqueci minha senha" (ver resetPasswordForEmail em
 * lib/supabase.ts). O Supabase já cria uma sessão temporária de recuperação
 * assim que a pessoa clica no link do e-mail — essa página só precisa
 * aguardar essa sessão (useAuth) e deixar escolher a nova senha.
 */
export default function RedefinirSenhaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');

    if (password.length < 6) {
      setErr('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setErr('As senhas não são iguais.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Não deu pra trocar a senha agora. Tente pedir o link de novo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-16">
        <h1 className="font-display text-3xl font-normal text-tinta">Redefinir senha</h1>

        {authLoading ? (
          <p className="text-[15px] text-tinta/70">Carregando…</p>
        ) : !user ? (
          <div className="flex flex-col gap-3">
            <p className="text-[15px] text-tinta/70">
              Esse link de redefinição é inválido ou já expirou. Peça um novo link na tela de login.
            </p>
            <button type="button" onClick={() => router.push('/')} className="text-[15px] text-mar underline self-start">
              Voltar para a loja
            </button>
          </div>
        ) : done ? (
          <div className="flex flex-col gap-3">
            <p className="text-[15px] text-tinta">Senha atualizada! Você já pode fazer login com ela.</p>
            <button type="button" onClick={() => router.push('/')} className="text-[15px] text-mar underline self-start">
              Ir para a loja
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3.5">
            <label className="flex flex-col gap-1.5 text-sm">
              Nova senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Confirmar nova senha
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                autoComplete="new-password"
                className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700"
              />
            </label>

            {err && (
              <div role="alert" className="rounded-sm bg-terra/10 px-3 py-2 text-sm text-terra">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-[50px] rounded-sm bg-terra text-sm font-medium uppercase tracking-widest text-white transition hover:bg-terra-700 disabled:opacity-60"
            >
              {loading ? 'Um momento…' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
