import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

/**
 * Bloco editorial — colagem de duas fotos (uma grande, uma menor sobreposta)
 * com o texto da categoria ao lado. Bordas retas, sem rotação e sem
 * gradiente: a mesma quietude de vitrine da referência (Lenny Niemeyer),
 * deixando a fotografia falar em vez de truques de moldura.
 */
export function CategoryShowcase({
  kicker,
  title,
  body,
  href,
  mainImage,
  secondaryImage,
  reverse = false,
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
  mainImage?: { src: string; alt: string } | null;
  secondaryImage?: { src: string; alt: string } | null;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
      <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
          <div className="group absolute inset-0 right-10 top-0 overflow-hidden bg-areia-200">
            {mainImage ? (
              <Image src={mainImage.src} alt={mainImage.alt} fill sizes="(max-width: 768px) 70vw, 360px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            ) : (
              <div className="h-full w-full bg-areia-300" />
            )}
          </div>
          {/* segunda foto, sobreposta, com friso fino único — sem rotação,
              sem gradiente, bordas retas. */}
          <div className="absolute bottom-0 right-0 h-[58%] w-[52%] border border-areia-50 bg-areia-300">
            {secondaryImage ? (
              <Image src={secondaryImage.src} alt={secondaryImage.alt} fill sizes="220px" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-areia-200" />
            )}
          </div>
        </Reveal>

        <Reveal delay={120} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-terra/40" aria-hidden />
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-terra">{kicker}</span>
          </div>
          <h2 className="font-display text-pretty text-[32px] italic text-tinta md:text-[46px] md:leading-[1.1]">{title}</h2>
          <p className="max-w-prose text-[15px] leading-relaxed text-tinta/65">{body}</p>
          <Link href={href} className="group mt-2 inline-flex w-fit items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-tinta">
            Ver mais
            <span className="h-px w-7 bg-tinta transition-all duration-300 group-hover:w-11" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
