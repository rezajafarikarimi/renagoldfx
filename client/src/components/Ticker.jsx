import { useEffect, useState } from 'react';
import { Radio, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { get, formatPrice } from '../lib/api.js';
import { useLang } from '../lib/lang.jsx';

function TickerItem({ item }) {
  const positive = item.change !== null && item.change >= 0;
  const neutral = item.change === null || item.price === null;
  return (
    <div className="flex items-center gap-2 border-e border-white/[0.06] px-4 py-1.5">
      <span className="ticker-symbol text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80" data-symbol={item.symbol}>
        {item.symbol}
      </span>
      <span className={`text-[11px] tabular-nums ${neutral ? 'text-mute/70' : 'text-white/90'}`}>
        {formatPrice(item.price, item.decimals ?? 2)}
      </span>
      {item.change === null ? (
        <span className="text-[9.5px] uppercase tracking-wide text-mute/45">
          {item.kind === 'brand' ? 'RENA' : '—'}
        </span>
      ) : (
        <span
          className={`flex items-center gap-0.5 text-[10.5px] tabular-nums ${
            positive ? 'text-up' : 'text-down'
          }`}
        >
          {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {Math.abs(item.change).toFixed(2)}%
        </span>
      )}
    </div>
  );
}

export default function Ticker() {
  const { L } = useLang();
  const [payload, setPayload] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await get('/market/ticker');
        if (!alive) return;
        setPayload(data);
        setFailed(false);
      } catch {
        if (alive) setFailed(true);
      }
    };
    load();
    const timer = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const demo = failed || !payload || payload.source === 'demo';
  const items = payload?.items || [];
  const track = items.length ? items : [];
  const duplicated = track.length ? [...track, ...track] : [];

  return (
    <div className="market-ticker border-b border-white/[0.06] bg-[#040506]" dir="ltr">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center gap-3 px-3 sm:px-5">
        <div className="flex shrink-0 items-center gap-1.5 border-e border-white/[0.06] pe-3">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-70 ${
                demo ? 'bg-gold' : 'animate-ping bg-up'
              }`}
            />
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${demo ? 'bg-gold' : 'bg-up'}`} />
          </span>
          <Radio size={11} className={demo ? 'text-gold/80' : 'text-up/80'} />
          <span className={`text-[9.5px] font-semibold uppercase tracking-[0.14em] ${demo ? 'text-gold/80' : 'text-up/80'}`}>
            {demo ? L('داده نمایشی', 'Demo data') : L('زنده', 'Live')}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5].map((key) => (
              <div key={key} className="h-2 w-24 animate-pulse rounded bg-white/[0.06]" />
            ))}
          </div>
        ) : (
          <div className="ticker-mask flex-1 overflow-hidden">
            <div className="ticker-track">
              {duplicated.map((item, index) => (
                <TickerItem key={`${item.symbol}-${index}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
