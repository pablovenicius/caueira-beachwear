import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// ⚠️ Server-only — usa o access token privado do Mercado Pago. Nunca
// importe este arquivo num componente 'use client' (o token vazaria pro
// navegador). Só é usado dentro de app/api/**/route.ts.

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error(
    'Mercado Pago não configurado: defina MERCADOPAGO_ACCESS_TOKEN no .env.local / nas env vars da Vercel (Suas integrações → sua aplicação → Credenciais, no painel do Mercado Pago).',
  );
}

const mercadoPagoClient = new MercadoPagoConfig({ accessToken });

export const mpPreference = new Preference(mercadoPagoClient);
export const mpPayment = new Payment(mercadoPagoClient);
