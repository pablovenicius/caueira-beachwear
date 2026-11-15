import type { Config } from 'tailwindcss';

// Paleta extraída da logomarca Caueira Beachwear — sol, terra, areia, tinta
// e mar. Consolidada nesta reformulação: "cafe" foi incorporado a "tinta"
// (eram dois pretos quentes quase idênticos) e "mar"/"terra" ganharam tons
// extras pra servir de bloco de cor cheio (seção editorial escura), não só
// de detalhe de texto.
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sol: { DEFAULT: '#C4903F', 100: '#F3E3C8', 700: '#8A5A1F' }, // dourado da logo · bronze p/ texto (5.0:1)
        terra: { DEFAULT: '#A8402A', 100: '#F1DDD4', 700: '#852E1C' }, // argila · CTA — branco 5.7:1
        areia: { 50: '#FBF7F1', 100: '#F4EBDD', 200: '#EFE3CF', 300: '#E3D5BE' },
        tinta: '#2A1F16', // preto quente — texto, rodapé, fundo do header fixo
        mar: { DEFAULT: '#2E5C50', 100: '#DEEAE6', 700: '#1C3830' }, // verde-mar profundo — bloco editorial escuro
      },
      fontFamily: {
        display: ['var(--font-marcellus)', 'serif'],
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      aspectRatio: { product: '4 / 5' },
      maxWidth: { prose: '62ch' },
    },
  },
  plugins: [],
} satisfies Config;
