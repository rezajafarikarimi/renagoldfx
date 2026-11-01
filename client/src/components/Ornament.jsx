export function CornerFrame({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <span className="absolute start-2.5 top-2.5 h-5 w-5 border-s border-t border-gold/45" />
      <span className="absolute end-2.5 top-2.5 h-5 w-5 border-e border-t border-gold/45" />
      <span className="absolute bottom-2.5 start-2.5 h-5 w-5 border-b border-s border-gold/45" />
      <span className="absolute bottom-2.5 end-2.5 h-5 w-5 border-b border-e border-gold/45" />
    </div>
  );
}

export function GoldDivider({ label, className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="gold-rule h-px w-14 sm:w-24" />
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/60 bg-gold/30" />
      {label ? (
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-gold/75">{label}</span>
      ) : null}
      <span className="h-1.5 w-1.5 rotate-45 border border-gold/60 bg-gold/30" />
      <span className="gold-rule h-px w-14 sm:w-24" />
    </div>
  );
}
