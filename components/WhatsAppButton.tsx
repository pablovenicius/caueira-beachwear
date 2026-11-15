// ⚠️ Troque o número abaixo (formato 55 + DDD + número, só dígitos) pelo
// WhatsApp real da loja antes de publicar — hoje é um número de exemplo.
const WHATSAPP_NUMBER = '5579999999999';
const MESSAGE = 'Olá! Tenho uma dúvida sobre um produto da Caueira Beachwear.';

export function WhatsAppButton({ hideOnMobile = false }: { hideOnMobile?: boolean }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className={`fixed bottom-[calc(var(--bottom-nav-h)+16px)] right-4 z-20 grid h-14 w-14 place-items-center rounded-full bg-mar text-white shadow-[0_6px_20px_rgba(11,36,54,0.3)] transition hover:bg-mar-700 md:bottom-6 md:right-6 ${
        hideOnMobile ? 'max-md:hidden' : ''
      }`}
    >
      <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.38a9.87 9.87 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.93 1.37-.49.07-1.1.1-1.78-.11a16.2 16.2 0 0 1-1.6-.59c-2.82-1.22-4.65-4.06-4.8-4.25-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.98-2.35.26-.28.56-.35.75-.35h.54c.17 0 .4-.06.63.48.24.57.81 1.97.88 2.11.07.14.12.3.02.49-.1.19-.15.3-.3.47-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.28.75 1.23 1.6 1.99 1.1.98 2.03 1.28 2.31 1.42.28.14.45.12.61-.07.17-.19.72-.84.91-1.13.19-.28.38-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
      </svg>
    </a>
  );
}
