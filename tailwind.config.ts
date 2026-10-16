import type { Config } from 'tailwindcss';

// Paleta extraída da logomarca Caueira Beachwear
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sol: { DEFAULT: '#C4903F', 700: '#8A5A1F' },   // dourado da logo · bronze p/ texto (5.0:1)
        terra: { DEFAULT: '#B5432B', 700: '#9A3622' }, // CTA – branco 5.5:1
        areia: { 50: '#FBF7F1', 100: '#F4EBDD', 200: '#EFE3CF', 300: '#E3D5BE' },
        cafe: '#3A2A1E',
        tinta: '#2A1F16',
        mar: '#3E7A5C',
      },
      fontFamily: {
        display: ['var(--font-marcellus)', 'serif'],
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
      },
      aspectRatio: { product: '4 / 5' },
    },
  },
  plugins: [],
} satisfies Config;
