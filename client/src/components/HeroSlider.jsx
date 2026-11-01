import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CityScene, DeskScene } from './Art.jsx';
import { LogoMark } from './Brand.jsx';
import { CornerFrame } from './Ornament.jsx';
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

  return (
    <section
      className="relative overflow-hidden rounded-[26px] border border-gold/25 bg-[#060506] shadow-panel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={L('بنر معرفی RENA', 'RENA hero banner')}
    >
      <CityScene className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,4,3,.4)_0%,rgba(5,4,3,.12)_36%,rgba(5,4,3,.6)_82%,rgba(5,4,3,.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_42%,transparent_22%,rgba(5,4,3,.42)_100%)]" />
      <CornerFrame className="z-20" />

      <div className="relative z-10 grid items-center gap-8 px-5 pb-8 pt-9 sm:px-8 lg:min-h-[540px] lg:grid-cols-[1.05fr_0.82fr_1.05fr] lg:gap-6 lg:px-10 lg:pb-10 lg:pt-12">
        <div className="order-2 animate-fade-up text-center lg:order-none lg:text-start" key={slide.id}>
          <span className="chip-gold border-gold/35 bg-black/40 backdrop-blur-sm">
            <Sparkles size={11} />
            {L('پلتفرم معاملاتی RENA', 'RENA trading platform')}
          </span>

          <h1 className="mt-4 text-[28px] font-extrabold leading-[1.32] tracking-tight sm:text-[38px] lg:text-[44px]">
            <span className="gold-text drop-shadow-[0_2px_18px_rgba(232,182,78,0.25)]">
              {L(slide.titleFa, slide.titleEn)}
            </span>
          </h1>

          <p className="mt-3 text-[13px] leading-relaxed text-[#E9DFCB]/85 sm:text-sm">
            {L(slide.subtitleFa, slide.subtitleEn)}
          </p>

          <p className="font-script mt-4 text-[26px] leading-tight text-gold/90 sm:text-[32px]">
            Trade Together · Grow Together
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link to={slide.ctaHref || '/register'} className="btn btn-gold">
              {L(slide.ctaLabel || 'شروع کنید', slide.ctaLabel || 'Get started')}
            </Link>
            <Link
              to="/services"
              className="btn border border-gold/45 bg-black/35 text-gold backdrop-blur-sm hover:border-gold/70 hover:bg-gold/10"
            >
              {L('معرفی خدمات', 'Explore services')}
            </Link>
          </div>

          <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-[#E9DFCB]/45">
            {L('دو ذهن • یک چشم‌انداز', 'Two minds • one vision')}
          </p>
        </div>

        <div className="order-1 flex flex-col items-center justify-center lg:order-none">
          <div className="relative flex items-center justify-center">
            <span className="absolute h-[196px] w-[196px] rounded-full border border-gold/25 sm:h-[230px] sm:w-[230px]" />
            <span className="absolute h-[152px] w-[152px] rounded-full border border-gold/20 sm:h-[178px] sm:w-[178px]" />
            <span className="absolute h-[248px] w-[248px] rounded-full bg-gold/[0.07] blur-2xl" />
            <LogoMark size={132} className="relative drop-shadow-[0_10px_30px_rgba(232,182,78,0.28)]" />
          </div>
          <p className="gold-text mt-2 text-xl font-extrabold tracking-[0.42em] sm:text-2xl">RENA</p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.4em] text-[#E9DFCB]/60">
            Trading Couple
          </p>
          <p className="font-serif-gold mt-2 text-[12px] italic tracking-[0.22em] text-gold/70">
            Two Minds · One Vision
          </p>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <DeskScene className="w-full max-w-[360px] opacity-95 drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-gold/15 bg-black/35 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          {slides.map((item, dotIndex) => (
            <button
              key={item.id || dotIndex}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`${L('اسلاید', 'Slide')} ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`h-1.5 rounded-full transition-all ${
                dotIndex === index ? 'w-7 bg-gold' : 'w-2.5 bg-gold/25 hover:bg-gold/50'
              }`}
            />
          ))}
          <span className="ms-2 text-[10px] tabular-nums text-[#E9DFCB]/50">
            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => go(-1)}
            className="rounded-lg border border-gold/25 p-1.5 text-gold/70 transition hover:border-gold/60 hover:text-gold"
            aria-label={L('اسلاید قبلی', 'Previous slide')}
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-lg border border-gold/25 p-1.5 text-gold/70 transition hover:border-gold/60 hover:text-gold"
            aria-label={L('اسلاید بعدی', 'Next slide')}
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
