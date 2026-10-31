import { Router } from 'express';
import { query } from '../db.js';
import { wrap, HttpError, camelAll } from '../util.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true, service: 'rena-api' }));

/* ---------------------------------- market --------------------------------- */

const DEMO_ITEMS = [
  { symbol: 'BTC/USDT', price: 68420.15, change: 1.24, decimals: 2 },
  { symbol: 'ETH/USDT', price: 3180.44, change: -0.86, decimals: 2 },
  { symbol: 'XAU/USD', price: 2712.8, change: 0.42, decimals: 2 },
  { symbol: 'EUR/USD', price: 1.0865, change: 0.11, decimals: 4 },
  { symbol: 'GBP/USD', price: 1.2721, change: -0.19, decimals: 4 },
];

const BRAND_ITEM = { symbol: 'RENA', price: null, change: null, decimals: 2, kind: 'brand' };

let marketCache = { at: 0, payload: null };

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
  if (!response.ok) throw new Error(`upstream_${response.status}`);
  return response.json();
}

async function livePayload() {
  const coins = await getJson(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true',
  );
  if (!coins?.bitcoin?.usd) throw new Error('no_coin_data');

  let rates = {};
  try {
    const fx = await getJson('https://open.er-api.com/v6/latest/USD');
    rates = fx?.rates || {};
  } catch {
    rates = {};
  }

  let goldPrice = null;
  try {
    const gold = await getJson('https://api.gold-api.com/price/XAU');
    goldPrice = Number(gold?.price) || null;
  } catch {
    goldPrice = null;
  }

  const invert = (code) => (rates[code] ? Number((1 / rates[code]).toFixed(4)) : null);

  const items = [
    { symbol: 'BTC/USDT', price: coins.bitcoin.usd, change: coins.bitcoin.usd_24h_change ?? null, decimals: 2 },
    { symbol: 'ETH/USDT', price: coins.ethereum?.usd ?? null, change: coins.ethereum?.usd_24h_change ?? null, decimals: 2 },
    { symbol: 'XAU/USD', price: goldPrice, change: null, decimals: 2 },
    { symbol: 'EUR/USD', price: invert('EUR'), change: null, decimals: 4 },
    { symbol: 'GBP/USD', price: invert('GBP'), change: null, decimals: 4 },
  ].filter((item) => item.price !== null);

  if (!items.length) throw new Error('no_market_data');

  return {
    source: 'live',
    status: 'connected',
    message: 'قیمت‌ها از منابع عمومی بازار دریافت می‌شوند.',
    updatedAt: new Date().toISOString(),
    items: [...items, BRAND_ITEM],
  };
}

function demoPayload(note = 'اتصال به منبع بازار برقرار نیست — داده نمایشی است.') {
  return {
    source: 'demo',
    status: 'disconnected',
    message: note,
    updatedAt: new Date().toISOString(),
    items: DEMO_ITEMS.map((item) => ({ ...item })).concat(BRAND_ITEM),
  };
}

async function marketSourceSetting() {
  const { rows } = await query("select value from site_settings where key = 'market_source'");
  const value = rows[0]?.value;
  return typeof value === 'string' ? value : 'auto';
}

router.get(
  '/market/ticker',
  wrap(async (req, res) => {
    const now = Date.now();
    if (marketCache.payload && now - marketCache.at < 60_000) {
      return res.json(marketCache.payload);
    }

    const source = await marketSourceSetting();
    let payload;
    if (source === 'demo') {
      payload = demoPayload('منبع داده نمایشی توسط مدیر انتخاب شده است.');
    } else {
      try {
        payload = await livePayload();
      } catch {
        payload = demoPayload();
      }
    }

    marketCache = { at: now, payload };
    res.json(payload);
  }),
);

/* --------------------------------- content -------------------------------- */

router.get(
  '/public/plans',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select id, code, name_fa, name_en, description_fa, description_en,
              min_amount::float8 as min_amount, max_amount::float8 as max_amount,
              roi_percent::float8 as roi_percent, duration_days
       from plans
       where active = true and is_public = true and code <> 'POOL1'
       order by min_amount asc`,
    );
    res.json({ plans: camelAll(rows) });
  }),
);

router.get(
  '/public/banners',
  wrap(async (req, res) => {
    const { rows } = await query(
      'select id, title_fa, title_en, subtitle_fa, subtitle_en, cta_label, cta_href, sort from banners where active = true order by sort asc',
    );
    res.json({ banners: camelAll(rows) });
  }),
);

router.get(
  '/public/site',
  wrap(async (req, res) => {
    const { rows } = await query('select key, value from site_settings');
    const settings = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json({
      announcement: settings.announcement || '',
      serviceCards: Array.isArray(settings.service_cards) ? settings.service_cards : [],
      contact: settings.contact || {},
    });
  }),
);

export default router;
