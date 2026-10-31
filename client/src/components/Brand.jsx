import { Link } from 'react-router-dom';
import { useLang } from '../lib/lang.jsx';

export function LogoMark({ size = 38, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="rena-gold" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD777" />
          <stop offset="0.52" stopColor="#E8B64E" />
          <stop offset="1" stopColor="#99702C" />
        </linearGradient>
      </defs>
      <circle cx="18.5" cy="24" r="11.5" stroke="url(#rena-gold)" strokeWidth="1.5" />
      <circle cx="29.5" cy="24" r="11.5" stroke="url(#rena-gold)" strokeWidth="1.5" opacity="0.55" />
      <path d="M24 14.5 26.4 21.6 33.5 24 26.4 26.4 24 33.5 21.6 26.4 14.5 24 21.6 21.6Z" fill="url(#rena-gold)" opacity="0.92" />
    </svg>
  );
}

export function Brand({ size = 38, compact = false, className = '' }) {
  const { L } = useLang();
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="RENA TRADING COUPLE">
      <LogoMark size={size} className="shrink-0 transition group-hover:opacity-90" />
      <span className="flex flex-col leading-none">
        <span className="gold-text text-[15px] font-extrabold tracking-[0.24em]">RENA</span>
        {!compact ? (
          <span className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.3em] text-mute/70">
            {L('تریدینگ کوپل', 'TRADING COUPLE')}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function Slogan({ className = '' }) {
  const { L } = useLang();
  return (
    <p className={`text-[10px] font-medium uppercase tracking-[0.34em] text-mute/60 ${className}`}>
      {L('دو ذهن • یک چشم‌انداز', 'Two minds • one vision')}
    </p>
  );
}
