const ITEMS = [
  'PROTEÇÃO UV50+',
  'ENTREGA PRA TODO O BRASIL',
  'TROCA GRÁTIS EM 30 DIAS',
  '5% OFF NO PIX',
  'TECIDO QUE NÃO DESBOTA',
  'CAIMENTO SEM MARCAS',
];

/**
 * Faixa de texto em loop contínuo — a única seção do site que se move
 * sozinha, de propósito: uma mecânica que nenhum outro bloco usa, pra
 * marcar a transição entre o hero escuro e o resto da página.
 */
export function Marquee() {
  return (
    <div className="cut-bottom relative overflow-hidden bg-noite pb-10 pt-3.5 md:pb-14" aria-hidden>
      <div className="marquee-track">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex flex-none items-center gap-8 px-4 text-[13px] font-semibold tracking-[0.15em] text-areia-50/90">
            {item}
            <span className="text-rosa">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
