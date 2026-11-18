const ITEMS = [
  'PROTEÇÃO UV50+',
  'ENTREGA PRA TODO O BRASIL',
  'TROCA GRÁTIS EM 30 DIAS',
  '5% OFF NO PIX',
  'TECIDO QUE NÃO DESBOTA',
  'CAIMENTO SEM MARCAS',
];

/**
 * Faixa de texto em loop contínuo — clara e discreta, letras bem espaçadas
 * como uma legenda editorial, não um banner promocional gritando.
 */
export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-areia-200 bg-areia-100 py-3" aria-hidden>
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex flex-none items-center gap-8 px-4 text-[12px] font-medium tracking-[0.18em] text-tinta/60">
            {item}
            <span className="text-sol-700" aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
