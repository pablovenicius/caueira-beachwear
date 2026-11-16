'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Revelação suave ao rolar a página — o único "efeito tecnológico" de
 * entrada usado no site inteiro, sempre com o mesmo timing/curva, pra ter
 * cara de decisão de design e não de efeito espalhado em tudo. Usa
 * IntersectionObserver (dispara uma vez, não fica recalculando no scroll) e
 * respeita prefers-reduced-motion via CSS (ver globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'span';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
