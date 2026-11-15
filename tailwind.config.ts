import type { Config } from 'tailwindcss';

// Reformulação completa (nov/2026): a paleta anterior (cream + argila + verde,
// serif clássica) media como "mais um e-commerce feito por IA" — exatamente o
// clichê que a direção de design evita. Nova direção: papel quase-branco frio,
// tinta grafite-azulada (não mais marrom), um único acento vívido (coral-sol,
// "flare") usado só em preço/CTA/promoção, e um azul-noite profundo pros
// blocos de contraste (rodapé, nav inferior). Os NOMES dos tokens continuam
// os mesmos de antes — isso é proposital: todo o painel admin, checkout,
// modais etc. herdam a nova identidade automaticamente, sem precisar tocar
// nesses arquivos (cascata de token do Tailwind).
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // acento vívido — preço no Pix, selos de promoção, CTA principal
        terra: { DEFAULT: '#FF5B3C', 100: '#FFE4DC', 700: '#B8311A' },
        // acento quente secundário — pouco usado, só pra pontuar (favicon, detalhe de ícone)
        sol: { DEFAULT: '#FFB238', 100: '#FFEFD2', 700: '#92591A' },
        // neutros "papel" — frios, quase brancos, substituem o bege antigo
        areia: { 50: '#FAF8F5', 100: '#F2EEE7', 200: '#E6E0D6', 300: '#D7CFC0' },
        // texto e chrome — grafite-azulado, não mais marrom
        tinta: '#15171B',
        // bloco de contraste total — azul-noite profundo (rodapé, nav mobile, seções cheias)
        mar: { DEFAULT: '#0B2436', 100: '#DCE4E8', 700: '#061722' },
      },
      fontFamily: {
        // Fraunces: serif contemporânea de alto contraste — manchetes editoriais,
        // bem diferente da Marcellus (clássica/suave) usada na tentativa anterior.
        display: ['var(--font-fraunces)', 'serif'],
        // Archivo: grotesca geométrica, confiante, mais densa que a Jost —
        // lê melhor em telas pequenas e em botões/labels de interface.
        sans: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
      },
      aspectRatio: { product: '4 / 5' },
      maxWidth: { prose: '62ch' },
      boxShadow: {
        sheet: '0 -8px 30px rgba(11,36,54,0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
