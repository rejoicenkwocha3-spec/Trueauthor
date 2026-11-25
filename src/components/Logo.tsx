export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M6 12h27v7H22.5v33H14V19H6z" fill="#102A43" />
      <path d="M35 10 22 38h7l4-9h12l-5-8H36l4-8z" fill="#2864DC" opacity="0" />
      <path d="M40 8h6l14 44h-8.5z" fill="#2864DC" />
      <path d="M40 8 30 30l6.5 3.5z" fill="#2864DC" />
      <path d="M22 54c8-14 22-23 38-24-12 4-22 12-29 24z" fill="#FF654F" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-brand-navy'}`}>TrueAuthor</span>
    </span>
  );
}
