'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Em vez de contar 0→valor de forma linear e previsível, os dígitos
 * "embaralham" por alguns quadros e vão travando da esquerda pra direita
 * no valor final — efeito de decodificação, mais surpreendente e "tech"
 * que uma contagem comum. Dispara uma única vez, via IntersectionObserver.
 */
export function ScrambleStat({ value, frames = 11, frameMs = 45 }: { value: string; frames?: number; frameMs?: number }) {
  const parsed = useMemo(() => {
    const m = value.match(/(\D*)(\d+)(\D*)/);
    if (!m) return null;
    return { prefix: m[1], digits: m[2], suffix: m[3] };
  }, [value]);

  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState(() => parsed?.digits.replace(/\d/g, '0') ?? '');

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        const len = parsed.digits.length;
        let frame = 0;
        const timer = setInterval(() => {
          frame++;
          if (frame >= frames) {
            clearInterval(timer);
            setDisplay(parsed.digits);
            return;
          }
          const progress = frame / frames;
          setDisplay(
            parsed.digits
              .split('')
              .map((d, i) => (i / len < progress ? d : String(Math.floor(Math.random() * 10))))
              .join(''),
          );
        }, frameMs);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [parsed, frames, frameMs]);

  if (!parsed) return <span>{value}</span>;
  return (
    <span ref={ref} className="scramble-digit">
      {parsed.prefix}
      {display}
      {parsed.suffix}
    </span>
  );
}
