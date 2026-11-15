// Marca da Caueira, redesenhada como vetor + texto real (não mais a foto
// .jpeg de 498px que vazava fundo escuro nos cantos). Sol em SVG inline
// (currentColor, tingível por CSS) + nome tipografado em Fraunces — fica
// nítido em qualquer tamanho de tela, inclusive no favicon/ícone de app.
export function Logo({ variant = 'ink', className = '' }: { variant?: 'ink' | 'paper'; className?: string }) {
  const textColor = variant === 'paper' ? 'text-areia-50' : 'text-tinta';
  const tagColor = variant === 'paper' ? 'text-areia-50/55' : 'text-tinta/50';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SunMark className={variant === 'paper' ? 'text-areia-50' : 'text-tinta'} size={28} />
      <span className="flex flex-col items-start leading-none">
        <span className={`font-display text-[22px] italic ${textColor}`}>Caueira</span>
        <span className={`mt-0.5 text-[9px] font-semibold tracking-[0.28em] ${tagColor}`}>BEACHWEAR</span>
      </span>
    </span>
  );
}

export function SunMark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <g fill="currentColor">
        <path d="M50 2 L58 22 L50 30 L42 22 Z" />
        <path d="M50 98 L58 78 L50 70 L42 78 Z" />
        <path d="M2 50 L22 42 L30 50 L22 58 Z" />
        <path d="M98 50 L78 58 L70 50 L78 42 Z" />
        <path d="M15.86 15.86 L33.5 24.5 L29 29 L24.5 33.5 Z" />
        <path d="M84.14 84.14 L66.5 75.5 L71 71 L75.5 66.5 Z" />
        <path d="M15.86 84.14 L24.5 66.5 L29 71 L33.5 75.5 Z" />
        <path d="M84.14 15.86 L75.5 33.5 L71 29 L66.5 24.5 Z" />
        <circle cx="50" cy="50" r="19" />
      </g>
    </svg>
  );
}
