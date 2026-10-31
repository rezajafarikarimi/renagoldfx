import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CandleChart, PhoneMockup, MomentumArt } from './Art.jsx';
import { LogoMark } from './Brand.jsx';
import { get } from '../lib/api.js';
import { useLang } from '../lib/lang.jsx';

const FALLBACK = [
  {
    id: 'fallback-1',
    titleFa: 'با هم، به سوی آزادی مالی',
    titleEn: 'Together towards financial freedom',
    subtitleFa: 'پلتفرم معاملاتی RENA — دو ذهن، یک چشم‌انداز',
    subtitleEn: 'The RENA trading platform — two minds, one vision',
    ctaLabel: 'شروع کنید',
    ctaHref: '/register',
  },
  {
    id: 'fallback-2',
    titleFa: 'کپی ترید حرفه‌ای',
    titleEn: 'Professional copy trading',
    subtitleFa: 'مسیر تریدرهای حرفه‌ای را دقیقاً دنبال کنید',
    subtitleEn: 'Follow professional traders with precision',
    ctaLabel: 'مشاهده کپی ترید',
    ctaHref: '/copy-trade',
  },
  {
    id: 'fallback-3',
    titleFa: 'پراپ تریدینگ RENA',
    titleEn: 'RENA prop trading',
    subtitleFa: 'چالش‌های واقعی؛ سرمایه واقعی برای رشد شما',
    subtitleEn: 'Real challenges, real capital to grow',
    ctaLabel: 'شروع چالش',
    ctaHref: '/prop',
  },
];

export default function HeroSlider() {
  const { L } = useLang();
  const [slides, setSlides] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let alive = true;
    get('/public/banners')
      .then((data) => {
        if (alive && data?.banners?.length) setSlides(data.banners);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const go = useCallback(
    (direction) => {
      setIndex((current) => (current + direction + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    timer.current = setInterval(() => go(1), 6500);
    return () => clearInterval(timer.current);
  }, [paused, go, slides.length, index]);

  const slide = slides[index] || FALLBACK[0];
  const variant = index % 3;

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[#0E1114] via-[#08090B] to-[#100C06] shadow-panel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={L('بنر معرفی RENA', 'RENA hero banner')}
    >
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-50" />
      <div className="pointer-events-none absolute -end-28 top-1/2 h-[460px] w-[460px] -translate-y-1/2 rounded-full bg-gold/[0.09] blur-3xl" />
      <CandleChart className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-[0.22]" height={240} />

      <div className="relative grid min-h-[440px] items-center gap-6 p-6 sm:p-8 lg:min-h-[480px] lg:grid-cols-[1.25fr_1fr] lg:p-10">
        <div className="animate-fade-up" key={slide.id}>
          <span className="chip-gold">
            <Sparkles size={11} />
            {L('پلتفرم معاملاتی RENA', 'RENA trading platform')}
          </span>

          <h1 className="mt-4 max-w-xl text-[26px] font-extrabold leading-[1.25] tracking-tight sm:text-4xl lg:text-[42px]">
            <span className="gold-text">{L(slide.titleFa, slide.titleEn)}</span>
          </h1>

          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-mute sm:text-sm">
            {L(slide.subtitleFa, slide.subtitleEn)}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={slide.ctaHref || '/register'} className="btn btn-gold">
              {L(slide.ctaLabel || 'شروع کنید', slide.ctaLabel || 'Get started')}
            </Link>
            <Link to="/services" className="btn btn-ghost">
              {L('معرفی خدمات', 'Explore services')}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.24em] text-mute/55">
            <span>{L('دو ذهن • یک چشم‌انداز', 'Two minds • one vision')}</span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span>Trade together • Grow together</span>
          </div>
        </div>

        <div className="relative hidden items-center justify-center lg:flex">
          {variant === 1 ? (
            <PhoneMockup />
          ) : variant === 2 ? (
            <MomentumArt className="h-[260px] w-full max-w-[380px]" />
          ) : (
            <div className="relative flex flex-col items-center">
              <div className="absolute h-[260px] w-[260px] animate-glow-pulse rounded-full border border-gold/20" />
              <div className="absolute h-[200px] w-[200px] rounded-full border border-gold/15" />
              <LogoMark size={148} />
              <p className="mt-4 text-[10px] uppercase tracking-[0.34em] text-mute/60">RENA TRADING COUPLE</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
        <div className="flex items-center gap-1.5">
          {slides.map((item, dotIndex) => (
            <button
              key={item.id || dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`${L('اسلاید', 'Slide')} ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`h-1.5 rounded-full transition-all ${
                dotIndex === index ? 'w-7 bg-gold' : 'w-2.5 bg-white/15 hover:bg-white/30'
              }`}
            />
          ))}
          <span className="ms-2 text-[10px] tabular-nums text-mute/50">
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            className="rounded-lg border border-white/10 p-1.5 text-mute transition hover:border-gold/40 hover:text-gold"
            aria-label={L('اسلاید قبلی', 'Previous slide')}
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-lg border border-white/10 p-1.5 text-mute transition hover:border-gold/40 hover:text-gold"
            aria-label={L('اسلاید بعدی', 'Next slide')}
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
