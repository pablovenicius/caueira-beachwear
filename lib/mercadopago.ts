import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// ⚠️ Server-only — usa o access token privado do Mercado Pago. Nunca
// importe este arquivo num componente 'use client' (o token vazaria pro
// navegador). Só é usado dentro de app/api/**/route.ts.
//
// A inicialização é "preguiçosa" (só roda dentro de getMpPreference /
// getMpPayment, nunca no topo do módulo) de propósito: a Vercel importa as
// rotas durante o build pra coletar metadados, e se o cliente do Mercado
// Pago fosse criado — e a variável de ambiente checada — no topo do
// arquivo, o build quebraria sempre que MERCADOPAGO_ACCESS_TOKEN não
// estivesse configurada, mesmo sem ninguém ter chamado a rota ainda.

let client: MercadoPagoConfig | null = null;

function getClient(): MercadoPagoConfig {
  if (!client) {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error(
        'Mercado Pago não configurado: defina MERCADOPAGO_ACCESS_TOKEN no .env.local / nas env vars da Vercel (Suas integrações → sua aplicação → Credenciais, no painel do Mercado Pago).',
      );
    }
    client = new MercadoPagoConfig({ accessToken });
  }
  return client;
}

export function getMpPreference() {
  return new Preference(getClient());
}

export function getMpPayment() {
  return new Payment(getClient());
}
