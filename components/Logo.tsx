import Image from 'next/image';

/**
 * A logo voltou a ser a marca original (o selo circular com o sol e
 * "Caueira Beachwear") — só que agora é um PNG de verdade: recortei o
 * círculo com precisão (sem o fundo escuro que sobrava nos cantos do
 * .jpeg original), removi os artefatos de compressão e escalei pra
 * 1024px, bem acima dos 498px do arquivo antigo. Por ser PNG com
 * transparência, o círculo se ajusta a qualquer fundo (claro ou escuro)
 * sem nenhum quadrado ou canto aparecendo ao redor.
 */
export function Logo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image src="/caueira-logo.png" alt="Caueira Beachwear" fill sizes={`${size}px`} className="object-contain" priority />
    </span>
  );
}
