'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { signInWithEmail, signInWithOAuth, signUpWithEmail } from '@/lib/supabase';

type Mode = 'login' | 'register';

export function AuthModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthErr, setOauthErr] = useState('');

  const oauth = async (provider: 'google' | 'facebook') => {
    setOauthErr('');
    try {
      await signInWithOAuth(provider);
      // o navegador é redirecionado pro provedor — nada mais a fazer aqui.
    } catch (e) {
      setOauthErr(e instanceof Error ? e.message : 'Não deu pra abrir o login social agora.');
    }
  };

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErr('');
    setNotice('');
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setErr('');
    setNotice('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setNotice('');

    if (!email.trim() || !password) {
      setErr('Preencha e-mail e senha.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setErr('Preencha seu nome.');
      return;
    }
    if (password.length < 6) {
      setErr('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
        reset();
        onOpenChange(false);
      } else {
        await signUpWithEmail(email.trim(), password, name.trim());
        setNotice('Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.');
        setPassword('');
      }
    } catch (e) {
      setErr(e instanceof Error ? traduzErro(e.message) : 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-tinta/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded bg-areia-50 p-7 shadow-xl">
          <Dialog.Title className="font-display text-2xl font-normal text-tinta">
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </Dialog.Title>
          <Dialog.Description className="mt-1.5 text-sm text-tinta/70">
            {mode === 'login'
              ? 'Acesse sua conta Caueira para acompanhar pedidos e favoritos.'
              : 'Leva menos de um minuto. Guarde seus dados para a próxima compra.'}
          </Dialog.Description>

          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => oauth('google')}
              className="flex h-11 items-center justify-center gap-2.5 rounded-sm border border-areia-300 bg-white text-sm font-medium text-tinta transition hover:bg-areia-100"
            >
              <GoogleIcon /> Continuar com Google
            </button>
            <button
              type="button"
              onClick={() => oauth('facebook')}
              className="flex h-11 items-center justify-center gap-2.5 rounded-sm border border-areia-300 bg-white text-sm font-medium text-tinta transition hover:bg-areia-100"
            >
              <FacebookIcon /> Continuar com Facebook
            </button>
          </div>

          {oauthErr && (
            <div role="alert" className="mt-3 rounded-sm bg-terra/10 px-3 py-2 text-sm text-terra">
              {oauthErr}
            </div>
          )}

          <div className="my-4 flex items-center gap-3 text-xs text-tinta/50">
            <span className="h-px flex-1 bg-areia-300" /> ou entre com e-mail <span className="h-px flex-1 bg-areia-300" />
          </div>

          <div className="grid grid-cols-2 rounded-full border border-areia-300 bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`h-9 rounded-full transition ${mode === 'login' ? 'bg-sol-700 text-white' : 'text-tinta/70'}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`h-9 rounded-full transition ${mode === 'register' ? 'bg-sol-700 text-white' : 'text-tinta/70'}`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 flex flex-col gap-3.5">
            {mode === 'register' && (
              <label className="flex flex-col gap-1.5 text-sm">
                Nome
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700"
                />
              </label>
            )}

            <label className="flex flex-col gap-1.5 text-sm">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
                className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm">
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="h-11 rounded-sm border border-areia-300 bg-white px-3 text-sm outline-none focus:border-sol-700"
              />
            </label>

            {err && (
              <div role="alert" className="rounded-sm bg-terra/10 px-3 py-2 text-sm text-terra">
                {err}
              </div>
            )}
            {notice && (
              <div role="status" className="rounded-sm bg-mar/10 px-3 py-2 text-sm text-mar">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-[50px] rounded-sm bg-terra text-sm font-medium uppercase tracking-widest text-white transition hover:bg-terra-700 disabled:opacity-60"
            >
              {loading ? 'Um momento…' : mode === 'login' ? 'Entrar' : 'Criar minha conta'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-tinta/60">
            {mode === 'login' ? (
              <>
                Ainda não tem conta?{' '}
                <button type="button" onClick={() => switchMode('register')} className="text-sol-700 underline">
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem conta?{' '}
                <button type="button" onClick={() => switchMode('login')} className="text-sol-700 underline">
                  Entrar
                </button>
              </>
            )}
          </p>

          <Dialog.Close
            aria-label="Fechar"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center text-tinta/50 hover:text-tinta"
          >
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7Z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35 26.9 36 24 36c-5.2 0-9.6-3.4-11.2-8l-6.6 5.1C9.9 39.7 16.4 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6c-.5.4 7.2-5.3 7.2-15.2 0-1.2-.1-2.4-.4-3.5Z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function traduzErro(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.';
  if (/already registered/i.test(msg)) return 'Esse e-mail já está cadastrado.';
  if (/email not confirmed/i.test(msg)) return 'Confirme seu e-mail antes de entrar — verifique sua caixa de entrada.';
  if (/password should be at least/i.test(msg)) return 'A senha precisa ter pelo menos 6 caracteres.';
  return msg;
}
