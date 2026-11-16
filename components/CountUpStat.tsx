'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Conta de 0 até o número da estatística quando ela entra na tela — um
 * único efeito, disparado uma vez. O parse de prefixo/número/sufixo é
 * memoizado por `value`: sem isso, o `.match()` cria um array novo a cada
 * render, o efeito re-executa, recria o IntersectionObserver e empilha
 * vários loops de animação ao mesmo tempo (o bug de "contar loucamente").
 */
export function CountUpStat({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const parsed = useMemo(() => {
    const m = value.match(/(\D*)(\d+)(\D*)/);
    if (!m) return null;
    return { prefix: m[1], target: parseInt(m[2], 10), suffix: m[3] };
  }, [value]);

  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(eased * parsed.target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [parsed, durationMs]);

  if (!parsed) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {parsed.prefix}
      {display}
      {parsed.suffix}
    </span>
  );
}
