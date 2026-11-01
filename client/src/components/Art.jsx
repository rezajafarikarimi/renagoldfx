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

const FAR_BUILDINGS = [
  [0, 70, 120], [70, 46, 170], [116, 62, 96], [178, 54, 140], [232, 78, 74],
  [310, 40, 118], [350, 66, 150], [416, 52, 92], [468, 84, 128], [552, 48, 76],
  [600, 70, 160], [670, 58, 110], [728, 92, 88], [820, 44, 136], [864, 66, 104],
  [930, 80, 152], [1010, 50, 90], [1060, 72, 122], [1132, 46, 168], [1178, 88, 100],
  [1266, 54, 132], [1320, 60, 96], [1380, 60, 140],
];

const NEAR_BUILDINGS = [
  [0, 90, 90], [90, 58, 140], [148, 74, 70], [222, 50, 120], [272, 96, 156],
  [368, 62, 84], [430, 78, 130], [508, 54, 96], [562, 88, 170], [650, 66, 110],
  [716, 104, 80], [820, 58, 146], [878, 74, 100], [952, 90, 160], [1042, 52, 88],
  [1094, 80, 132], [1174, 64, 108], [1238, 96, 150], [1334, 56, 92], [1390, 50, 130],
];

function SkylineLayer({ buildings, baseline, fill, seed = 0, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      {buildings.map(([x, w, h], index) => {
        const top = baseline - h;
        const cols = Math.max(1, Math.min(5, Math.floor((w - 12) / 20)));
        const rows = Math.max(1, Math.min(6, Math.floor((h - 16) / 24)));
        return (
          <g key={`${x}-${index}`}>
            <rect x={x} y={top} width={w} height={h} rx="2" fill={fill} />
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: cols }).map((__, col) => {
                const lit = (row * 3 + col * 5 + index + seed) % 5 !== 0;
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={x + 9 + col * 20}
                    y={top + 12 + row * 24}
                    width="3"
                    height="5"
                    rx="1"
                    fill={lit ? '#FFD777' : '#2A2116'}
                    opacity={lit ? 0.55 : 0.5}
                  />
                );
              }),
            )}
          </g>
        );
      })}
    </g>
  );
}

export function CityScene({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1440 620"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rena-city-sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1E1008" />
          <stop offset="0.34" stopColor="#5C3012" />
          <stop offset="0.56" stopColor="#B7621B" />
          <stop offset="0.7" stopColor="#6E3A13" />
          <stop offset="0.86" stopColor="#24150C" />
          <stop offset="1" stopColor="#0A0708" />
        </linearGradient>
        <radialGradient id="rena-city-sun" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#FFEFC4" />
          <stop offset="0.35" stopColor="#F6BE5C" stopOpacity="0.92" />
          <stop offset="1" stopColor="#E8B64E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rena-city-far" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#6B432A" />
          <stop offset="1" stopColor="#22150E" />
        </linearGradient>
        <linearGradient id="rena-city-near" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#3A2417" />
          <stop offset="1" stopColor="#0A0707" />
        </linearGradient>
        <linearGradient id="rena-city-water" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#2E1A0D" />
          <stop offset="1" stopColor="#070606" />
        </linearGradient>
        <radialGradient id="rena-city-vignette" cx="0.5" cy="0.45" r="0.72">
          <stop stopColor="#050403" stopOpacity="0" />
          <stop offset="0.68" stopColor="#050403" stopOpacity="0.35" />
          <stop offset="1" stopColor="#050403" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      <rect width="1440" height="620" fill="url(#rena-city-sky)" />
      <circle cx="1010" cy="368" r="260" fill="url(#rena-city-sun)" opacity="0.75" />
      <circle cx="1010" cy="368" r="66" fill="#FFE9BC" opacity="0.95" />
      <circle cx="1010" cy="368" r="110" fill="#F2B143" opacity="0.24" />

      <ellipse cx="360" cy="262" rx="260" ry="16" fill="#E8B64E" opacity="0.06" />
      <ellipse cx="980" cy="300" rx="320" ry="18" fill="#FFD777" opacity="0.07" />
      <ellipse cx="700" cy="332" rx="200" ry="10" fill="#F2B143" opacity="0.05" />

      <SkylineLayer buildings={FAR_BUILDINGS} baseline={474} fill="url(#rena-city-far)" seed={2} opacity={0.92} />
      <SkylineLayer buildings={NEAR_BUILDINGS} baseline={542} fill="url(#rena-city-near)" seed={0} />

      <path d="M0 544 Q 360 532 720 542 T 1440 538 L 1440 620 L 0 620 Z" fill="url(#rena-city-water)" />
      <ellipse cx="1010" cy="560" rx="120" ry="10" fill="#E8B64E" opacity="0.18" />
      <ellipse cx="1010" cy="582" rx="74" ry="6" fill="#FFD777" opacity="0.12" />
      <ellipse cx="1010" cy="602" rx="40" ry="4" fill="#FFD777" opacity="0.08" />

      <rect width="1440" height="620" fill="url(#rena-city-vignette)" />
    </svg>
  );
}

export function DeskScene({ className = '' }) {
  return (
    <svg viewBox="0 0 440 320" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rena-desk-lid" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#1A140C" />
          <stop offset="1" stopColor="#0C0A08" />
        </linearGradient>
        <linearGradient id="rena-desk-base" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#241A0F" />
          <stop offset="1" stopColor="#0A0908" />
        </linearGradient>
        <linearGradient id="rena-desk-mug" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#221809" />
          <stop offset="1" stopColor="#0C0A08" />
        </linearGradient>
        <linearGradient id="rena-desk-gold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFD777" />
          <stop offset="1" stopColor="#99702C" />
        </linearGradient>
      </defs>

      <ellipse cx="216" cy="286" rx="196" ry="16" fill="#E8B64E" opacity="0.09" />
      <ellipse cx="216" cy="286" rx="120" ry="8" fill="#050403" opacity="0.5" />

      <g>
        <rect x="66" y="66" width="252" height="168" rx="12" fill="url(#rena-desk-lid)" stroke="#E8B64E" strokeOpacity="0.4" />
        <rect x="78" y="78" width="228" height="144" rx="7" fill="#060809" />
        {[106, 134, 162, 190].map((y) => (
          <line key={y} x1="88" y1={y} x2="296" y2={y} stroke="#ffffff" strokeOpacity="0.055" />
        ))}
        {[
          { x: 98, body: 26, top: 44, up: true },
          { x: 124, body: 38, top: 34, up: false },
          { x: 150, body: 30, top: 46, up: true },
          { x: 176, body: 52, top: 28, up: true },
          { x: 202, body: 34, top: 40, up: false },
          { x: 228, body: 60, top: 22, up: true },
          { x: 254, body: 44, top: 30, up: true },
        ].map((candle, index) => (
          <g key={index}>
            <line
              x1={candle.x + 5}
              y1={206 - candle.top - candle.body - 8}
              x2={candle.x + 5}
              y2={206 - candle.top + 8}
              stroke={candle.up ? '#E8B64E' : '#F04452'}
              strokeOpacity="0.7"
            />
            <rect
              x={candle.x}
              y={206 - candle.top - candle.body}
              width="10"
              height={candle.body}
              rx="1.5"
              fill={candle.up ? 'url(#rena-desk-gold)' : '#F04452'}
              opacity={candle.up ? 0.92 : 0.5}
            />
          </g>
        ))}
        <path
          d="M88 178 C 128 166, 150 150, 186 146 S 246 116, 296 100"
          fill="none"
          stroke="#FFD777"
          strokeOpacity="0.7"
          strokeWidth="1.6"
          strokeDasharray="5 4"
        />
        <text x="92" y="96" fill="#E8B64E" fontSize="8" opacity="0.75" letterSpacing="2">
          RENA · BTC/USDT
        </text>
        <text x="248" y="96" fill="#20C77A" fontSize="8" opacity="0.85">
          +2.48%
        </text>
        <rect x="72" y="228" width="240" height="8" rx="4" fill="#E8B64E" opacity="0.12" />
      </g>

      <path d="M46 258 L 338 258 L 368 286 L 16 286 Z" fill="url(#rena-desk-base)" stroke="#E8B64E" strokeOpacity="0.22" />
      <path d="M62 258 L 322 258 L 340 270 L 44 270 Z" fill="#E8B64E" opacity="0.07" />

      <g>
        <path d="M330 200 C 358 200 366 214 366 226 C 366 238 358 246 342 246 L 342 232 C 350 232 353 229 353 226 C 353 221 348 218 340 218 L 330 218 Z" fill="#171008" stroke="#E8B64E" strokeOpacity="0.45" />
        <rect x="306" y="196" width="42" height="56" rx="8" fill="url(#rena-desk-mug)" stroke="#E8B64E" strokeOpacity="0.5" />
        <rect x="306" y="208" width="42" height="5" rx="2.5" fill="#E8B64E" opacity="0.55" />
        <text x="314" y="238" fill="#E8B64E" fontSize="10" fontWeight="700" letterSpacing="2">
          RENA
        </text>
        <path d="M318 190 C 314 180 322 174 318 164" fill="none" stroke="#FFD777" strokeOpacity="0.28" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M334 190 C 330 178 338 172 334 160" fill="none" stroke="#FFD777" strokeOpacity="0.18" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function BullArt({ className = '' }) {
  return (
    <svg viewBox="0 0 360 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="rena-bull-gold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#FFD777" />
          <stop offset="0.55" stopColor="#E8B64E" />
          <stop offset="1" stopColor="#8A6326" />
        </linearGradient>
      </defs>

      <circle cx="180" cy="108" r="86" fill="#E8B64E" opacity="0.07" />
      <circle cx="180" cy="108" r="58" fill="#E8B64E" opacity="0.05" />

      <path
        d="M22 176 C 86 158, 118 116, 154 108 S 246 84, 334 34"
        fill="none"
        stroke="#E8B64E"
        strokeOpacity="0.35"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M318 30 L 338 32 L 332 54" fill="none" stroke="#E8B64E" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <g fill="none" stroke="url(#rena-bull-gold)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M140 76 C 118 66 102 46 100 24 C 118 32 134 46 148 62" strokeWidth="3.4" />
        <path d="M220 76 C 242 66 258 46 260 24 C 242 32 226 46 212 62" strokeWidth="3.4" />
        <path
          d="M148 62 C 168 52 192 52 212 62 C 228 82 232 110 220 134 C 208 158 188 174 180 174 C 172 174 152 158 140 134 C 128 110 132 82 148 62 Z"
          strokeWidth="2.6"
        />
        <path d="M140 84 C 128 82 118 86 112 94 C 122 98 134 96 142 92" strokeWidth="2" opacity="0.75" />
        <path d="M220 84 C 232 82 242 86 248 94 C 238 98 226 96 218 92" strokeWidth="2" opacity="0.75" />
        <ellipse cx="180" cy="146" rx="24" ry="15" strokeWidth="1.6" opacity="0.6" />
      </g>
      <circle cx="162" cy="102" r="3" fill="#F6C766" />
      <circle cx="198" cy="102" r="3" fill="#F6C766" />
      <circle cx="171" cy="144" r="2" fill="#E8B64E" opacity="0.7" />
      <circle cx="189" cy="144" r="2" fill="#E8B64E" opacity="0.7" />
    </svg>
  );
}
