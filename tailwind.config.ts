import type { Config } from 'tailwindcss';

// Segunda reformulação (nov/2026): a direção anterior (papel frio + coral-sol
// vívido) ainda lia como "e-commerce bonito", mas o pedido agora é outro —
// elegante, moderno, com tecnologia, refinado. Trocamos o acento quente e
// saturado por um par mais contido: champagne metálico (sol) fazendo o
// trabalho de destaque "premium/tech" (bordas, foco, glass), e uma terracota
// escurecida e dessaturada (terra) reservada estritamente a preço/CTA — o
// mesmo papel que tinha antes, só mais discreta. "mar" deixa de ser azul-noite
// e passa a ser um petróleo bem mais escuro e frio ("abyss"), base de todo
// glassmorphism (hero, rodapé, nav flutuante). Os NOMES dos tokens continuam
// os mesmos — cascata automática pro admin, checkout, modais etc.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // terracota escurecida/dessaturada — só preço no Pix, CTA e selos de promoção
        terra: { DEFAULT: '#B8472E', 100: '#F1DDD3', 700: '#7A2E1C' },
        // champagne metálico — o acento "premium/tech": bordas no hover, foco, glow de preço
        sol: { DEFAULT: '#C9A24B', 100: '#F2E7CC', 700: '#7F611F' },
        // neutros "papel" — porcelana fria, mais branca e mais neutra que antes
        areia: { 50: '#FAFAF8', 100: '#F2F0EB', 200: '#E4E1D9', 300: '#D2CDC0' },
        // texto e chrome — grafite quase-preto, mais frio e mais denso
        tinta: '#0C0D10',
        // "abyss" — petróleo profundo, base do glass (hero, rodapé, nav flutuante)
        mar: { DEFAULT: '#0B1620', 100: '#DEE4E8', 700: '#050B11' },
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
        sheet: '0 -8px 30px rgba(11,22,32,0.22)',
        // glow sutil em champagne — usado só no painel do hero e no CTA em hover
        glow: '0 0 0 1px rgba(201,162,75,0.35), 0 12px 40px rgba(5,11,17,0.35)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
} satisfies Config;
