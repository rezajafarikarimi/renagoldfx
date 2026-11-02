import { TrendingUp, ShieldCheck, Lock } from 'lucide-react';

const CANDLES = [
  { x: 16, body: 42, top: 26, up: true },
  { x: 46, body: 58, top: 34, up: false },
  { x: 76, body: 96, top: 30, up: true },
  { x: 106, body: 46, top: 22, up: true },
  { x: 136, body: 72, top: 40, up: false },
  { x: 166, body: 118, top: 16, up: true },
  { x: 196, body: 54, top: 36, up: true },
  { x: 226, body: 64, top: 28, up: false },
  { x: 256, body: 128, top: 26, up: true },
  { x: 286, body: 88, top: 44, up: true },
  { x: 316, body: 52, top: 30, up: false },
  { x: 346, body: 108, top: 22, up: true },
  { x: 376, body: 74, top: 38, up: true },
  { x: 406, body: 92, top: 24, up: true },
  { x: 436, body: 62, top: 44, up: false },
  { x: 466, body: 120, top: 20, up: true },
];

export function CandleChart({ className = '', height = 260 }) {
  return (
    <svg
      viewBox="0 0 500 260"
      preserveAspectRatio="none"
      className={className}
      style={{ height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rena-candle-up" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFD777" />
          <stop offset="1" stopColor="#E8B64E" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="rena-area" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#E8B64E" stopOpacity="0.22" />
          <stop offset="1" stopColor="#E8B64E" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[40, 90, 140, 190, 240].map((y) => (
        <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
      ))}

      <path
        d="M0 208 C 40 196, 60 214, 96 186 S 150 168, 186 150 S 250 158, 292 116 S 348 108, 386 74 S 452 60, 500 34 L500 260 L0 260 Z"
        fill="url(#rena-area)"
      />
      <path
        d="M0 208 C 40 196, 60 214, 96 186 S 150 168, 186 150 S 250 158, 292 116 S 348 108, 386 74 S 452 60, 500 34"
        fill="none"
        stroke="#E8B64E"
        strokeOpacity="0.5"
        strokeWidth="1.6"
      />

      {CANDLES.map((candle, index) => {
        const bodyTop = 240 - candle.top;
        const bodyHeight = candle.body;
        const wickTop = bodyTop - 14;
        const wickBottom = bodyTop + bodyHeight + 14;
        return (
          <g key={index} opacity={candle.up ? 0.95 : 0.55}>
            <line
              x1={candle.x + 6}
              y1={wickTop}
              x2={candle.x + 6}
              y2={wickBottom}
              stroke={candle.up ? '#E8B64E' : '#F04452'}
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            <rect
              x={candle.x}
              y={bodyTop}
              width="12"
              height={bodyHeight}
              rx="1.5"
              fill={candle.up ? 'url(#rena-candle-up)' : 'rgba(240,68,82,0.35)'}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function PhoneMockup({ className = '' }) {
  return (
    <div className={`relative mx-auto w-[168px] ${className}`}>
      <div className="absolute -inset-6 rounded-full bg-gold/15 blur-2xl" aria-hidden="true" />
      <div className="relative rounded-[26px] border border-gold/30 bg-gradient-to-b from-[#141008] to-[#090705] p-1.5 shadow-gold">
        <div className="rounded-[20px] border border-white/5 bg-[#07090B] p-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/15" />
          <div className="flex items-center justify-between text-[8px] text-mute/70">
            <span>RENA COPY</span>
            <span className="text-up">+18.4%</span>
          </div>
          <div className="mt-2 flex h-[86px] items-end gap-1">
            {[38, 52, 44, 66, 58, 78, 62, 88, 74, 96].map((h, index) => (
              <div
                key={index}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  background:
                    index % 3 === 2
                      ? 'linear-gradient(180deg,rgba(240,68,82,.55),rgba(240,68,82,.15))'
                      : 'linear-gradient(180deg,#FFD777,#99702C)',
                  opacity: index % 3 === 2 ? 0.8 : 0.9,
                }}
              />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              ['BTC/USDT', '+1.24%'],
              ['XAU/USD', '+0.42%'],
              ['EUR/USD', '+0.11%'],
            ].map(([symbol, change]) => (
              <div
                key={symbol}
                className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 text-[8px]"
              >
                <span className="text-white/80">{symbol}</span>
                <span className="text-up">{change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MomentumArt({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(60%_60%_at_50%_50%,rgba(232,182,78,.16),transparent_70%)]" />
      <svg viewBox="0 0 320 200" className="relative h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="rena-momentum" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFD777" />
            <stop offset="1" stopColor="#99702C" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160].map((y) => (
          <line key={y} x1="10" y1={y} x2="310" y2={y} stroke="rgba(255,255,255,0.05)" />
        ))}
        {[
          { x: 28, h: 46, up: true },
          { x: 62, h: 66, up: true },
          { x: 96, h: 54, up: false },
          { x: 130, h: 84, up: true },
          { x: 164, h: 70, up: true },
          { x: 198, h: 96, up: true },
          { x: 232, h: 118, up: true },
          { x: 266, h: 136, up: true },
        ].map((bar, index) => (
          <g key={index}>
            <rect
              x={bar.x}
              y={176 - bar.h}
              width="16"
              height={bar.h}
              rx="2"
              fill={bar.up ? 'url(#rena-momentum)' : 'rgba(240,68,82,.5)'}
              opacity={bar.up ? 0.92 : 0.75}
            />
            <line
              x1={bar.x + 8}
              y1={176 - bar.h - 12}
              x2={bar.x + 8}
              y2={176 + 4}
              stroke={bar.up ? '#E8B64E' : '#F04452'}
              strokeOpacity="0.45"
            />
          </g>
        ))}
        <path
          d="M24 168 C 70 150, 96 158, 140 118 S 212 92, 288 34"
          fill="none"
          stroke="#FFD777"
          strokeWidth="2"
          strokeOpacity="0.9"
          strokeLinecap="round"
          strokeDasharray="6 5"
        />
        <path d="M270 34 L 292 30 L 288 54" fill="none" stroke="#FFD777" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function MountainScene({ className = '' }) {
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rena-sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#0B0D10" />
          <stop offset="0.55" stopColor="#07080A" />
          <stop offset="1" stopColor="#050607" />
        </linearGradient>
        <linearGradient id="rena-horizon" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#E8B64E" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E8B64E" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rena-mountain-a" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1B1A16" />
          <stop offset="1" stopColor="#0A0B0C" />
        </linearGradient>
        <linearGradient id="rena-mountain-b" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#2A2418" />
          <stop offset="1" stopColor="#0B0C0D" />
        </linearGradient>
      </defs>
      <rect width="1440" height="260" fill="url(#rena-sky)" />
      <ellipse cx="720" cy="196" rx="520" ry="70" fill="url(#rena-horizon)" opacity="0.6" />
      <circle cx="720" cy="176" r="46" fill="#E8B64E" opacity="0.16" />
      <circle cx="720" cy="176" r="78" fill="#E8B64E" opacity="0.06" />
      <path d="M0 236 L 120 190 L 210 214 L 300 150 L 400 206 L 500 168 L 590 224 L 700 182 L 820 232 L 920 176 L 1010 214 L 1110 158 L 1210 208 L 1310 180 L 1440 232 L 1440 260 L 0 260 Z" fill="url(#rena-mountain-a)" />
      <path d="M0 260 L 90 214 L 200 244 L 320 206 L 420 240 L 540 200 L 640 246 L 760 208 L 880 244 L 1000 204 L 1120 242 L 1240 206 L 1340 238 L 1440 210 L 1440 260 Z" fill="url(#rena-mountain-b)" opacity="0.95" />
      <path d="M0 252 Q 360 232 720 250 T 1440 244 L 1440 260 L 0 260 Z" fill="#050607" />
    </svg>
  );
}

export function SecurityRow({ icon: Icon, title, note, active }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
      <span className="mt-0.5 rounded-lg border border-gold/25 bg-gold/10 p-1.5 text-gold">
        <Icon size={14} strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-white/90">{title}</p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-mute/65">{note}</p>
      </div>
      {active ? null : (
        <span className="ms-auto shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[9px] text-mute/70">
          soon
        </span>
      )}
    </div>
  );
}

export const SecurityIcons = { TrendingUp, ShieldCheck, Lock };
