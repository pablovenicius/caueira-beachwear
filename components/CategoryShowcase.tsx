import Image from 'next/image';
import Link from 'next/link';

/**
 * Bloco editorial inspirado na referência que o cliente trouxe (site da
 * Bautz): em vez de uma foto única, duas imagens em colagem — uma grande e
 * uma menor sobreposta, deslocada — com o texto da categoria ao lado e um
 * link com botão circular de seta ("Ver mais"), em vez do botão de sempre.
 * Alterna o lado da imagem a cada bloco (reverse) pra criar ritmo na página,
 * do jeito que a Bautz alterna Alianças/Mann.
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
  mainImage?: string | null;
  secondaryImage?: string | null;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-6 md:py-20">
      <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
          <div className="absolute inset-0 right-10 top-0 overflow-hidden bg-areia-200">
            {mainImage ? (
              <Image src={mainImage} alt="" fill sizes="(max-width: 768px) 70vw, 360px" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-areia-300" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 h-[58%] w-[52%] overflow-hidden border-4 border-areia-50 bg-areia-300 shadow-glow">
            {secondaryImage ? (
              <Image src={secondaryImage} alt="" fill sizes="220px" className="object-cover" />
            ) : (
              <div className="h-full w-full bg-areia-200" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-terra to-sol" aria-hidden />
            <span className="text-[13px] font-medium uppercase tracking-wide text-terra/80">{kicker}</span>
          </div>
          <h2 className="font-display text-pretty text-3xl text-tinta md:text-[40px] md:leading-[1.08]">{title}</h2>
          <p className="max-w-prose text-[15px] leading-relaxed text-tinta/70">{body}</p>
          <Link href={href} className="group mt-2 flex w-fit items-center gap-3 text-[14px] font-medium text-mar">
            Ver mais
            <span className="grid h-9 w-9 place-items-center rounded-full border border-mar/30 text-mar transition group-hover:border-mar group-hover:bg-mar group-hover:text-areia-50">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
