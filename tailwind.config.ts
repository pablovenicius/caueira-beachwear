import type { Config } from 'tailwindcss';

// Terceira reformulação (nov/2026): referência explícita do cliente — o site
// da Bautz (joalheria) — pedindo esse layout/efeitos/disposição de peças. A
// direção "dark glass tech" da segunda reformulação dá lugar a algo mais
// editorial e claro: terracota-caramelo nos títulos e CTAs (o papel que o
// vívido coral tinha antes, só que quente e desaturado, como o logo da
// Bautz), petróleo profundo em números/links/texto-forte (como os números
// "+50" do site de referência) e um creme-pergaminho de fundo — bem mais
// luminoso que o petróleo-abyss anterior. "mar" deixa de ser a base de vidro
// escuro e volta a ser só o acento petróleo pontual (texto, números, rodapé).
// Nomes dos tokens continuam os mesmos — cascata automática pro admin,
// checkout, modais etc.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // terracota-caramelo — títulos, CTA principal, preço no Pix (o acento "Bautz")
        terra: { DEFAULT: '#C17F4A', 100: '#F3E2CF', 700: '#8A5425' },
        // dourado mais claro — só detalhe pontual (friso, foco, selo), nunca a estrela
        sol: { DEFAULT: '#D9A441', 100: '#F6E8C9', 700: '#8F6A1F' },
        // creme-pergaminho — fundo principal, bem mais claro/quente que o "papel frio" anterior
        areia: { 50: '#FBF8F2', 100: '#F4EEE2', 200: '#E8E0CF', 300: '#D6CBB2' },
        // texto — grafite quente, não mais petróleo nem preto frio
        tinta: '#2B2420',
        // petróleo profundo — números, links, rodapé (o "azul" que acompanha o caramelo na Bautz)
        mar: { DEFAULT: '#1F4A4D', 100: '#DCE8E8', 700: '#0F2A2C' },
        // Quarta reformulação (nov/2026): o cliente pediu uma ruptura radical,
        // não um ajuste — mesma paleta-base, mas agora usada em blocos
        // escuros/diagonais com um acento vivo (coral-rosa, a cor do biquíni
        // de verdade usado nas fotos) em gradiente com o dourado. "noite" é o
        // preto quase-preto dos blocos de impacto (hero, manifesto, ticker).
        rosa: { DEFAULT: '#E8537A', 700: '#C23A5E' },
        noite: { DEFAULT: '#15110D', 700: '#0B0907' },
        // céu da praia (usado só na cena interativa porta→closet)
        ceu: { DEFAULT: '#BFE3EE', 700: '#6FB4CE' },
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
        sheet: '0 -8px 30px rgba(31,74,77,0.16)',
        // glow sutil em caramelo — painel do hero e CTA em hover
        glow: '0 0 0 1px rgba(193,127,74,0.35), 0 12px 36px rgba(31,74,77,0.22)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
} satisfies Config;
