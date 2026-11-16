'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Conta de 0 até o número da estatística quando ela entra na tela — um
 * único efeito, disparado uma vez, nada de recontar a cada scroll. Separa o
 * valor em prefixo/número/sufixo pra lidar com formatos como "+50",
 * "5%" ou "UV50+" sem precisar de uma versão por estatística.
 */
export function CountUpStat({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const match = value.match(/(\D*)(\d+)(\D*)/);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match ? 0 : null);

  useEffect(() => {
    if (!match) return;
    const el = ref.current;
    if (!el) return;
    const target = parseInt(match[2], 10);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [match, durationMs, value]);

  if (!match) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  );
}
