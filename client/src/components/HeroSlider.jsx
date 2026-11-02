import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReferenceArt from './ReferenceArt.jsx';
import { get } from '../lib/api.js';
import { useLang } from '../lib/lang.jsx';

const FALLBACK = [
  { id: 'welcome', titleFa: 'با هم، به سوی آزادی مالی', titleEn: 'Together towards financial freedom', subtitleFa: 'دو ذهن، یک چشم‌انداز', subtitleEn: 'Two minds, one vision', ctaLabel: 'شروع کنید', ctaHref: '/register' },
  { id: 'copy', titleFa: 'کپی ترید حرفه‌ای', titleEn: 'Professional copy trading', subtitleFa: 'مسیر تریدرهای حرفه‌ای را دنبال کنید', subtitleEn: 'Follow professional traders', ctaLabel: 'مشاهده کپی ترید', ctaHref: '/copy-trade' },
  { id: 'prop', titleFa: 'پراپ تریدینگ RENA', titleEn: 'RENA prop trading', subtitleFa: 'چالش‌های واقعی؛ سرمایه واقعی برای رشد شما', subtitleEn: 'Real challenges, real capital to grow', ctaLabel: 'شروع چالش', ctaHref: '/prop' },
];

export default function HeroSlider() {
  const { L, lang } = useLang();
  const [slides, setSlides] = useState(FALLBACK);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let alive = true;
    get('/public/banners').then((data) => {
      if (alive && data?.banners?.length) setSlides(data.banners);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
  const go = useCallback((step) => setIndex((current) => (current + step + slides.length) % slides.length), [slides.length]);
  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = setInterval(() => go(1), 6500);
    return () => clearInterval(timer);
  }, [paused, go, index, slides.length]);
  const slide = slides[index] || FALLBACK[0];

  return (
    <section className="reference-hero" aria-roledescription="carousel" aria-label={L('بنر معرفی RENA', 'RENA hero banner')}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <ReferenceArt region="hero" className="reference-hero-art" />
      <div className={`reference-hero-copy ${slide.titleFa === FALLBACK[0].titleFa && lang === 'fa' ? 'reference-hero-copy-original' : ''}`} aria-live="polite">
        <ReferenceArt region="logo" className="reference-mobile-logo" />
        <h1>{L(slide.titleFa, slide.titleEn)}</h1>
        <p>{L(slide.subtitleFa, slide.subtitleEn)}</p>
        <Link to={slide.ctaHref || '/register'} className="btn btn-gold btn-sm">{L(slide.ctaLabel || 'شروع کنید', 'Get started')}</Link>
      </div>
      <div className="reference-hero-controls" dir="ltr">
        <button type="button" onClick={() => go(-1)} aria-label={L('اسلاید قبلی', 'Previous slide')}><ChevronLeft size={15} /></button>
        <Link to="/services" className="reference-hero-services">{L('معرفی خدمات', 'Explore services')}</Link>
        <div className="reference-hero-dots">
          {slides.map((item, dot) => <button type="button" key={item.id || dot} onClick={() => setIndex(dot)} aria-label={`${L('اسلاید', 'Slide')} ${dot + 1}`} aria-current={dot === index} />)}
        </div>
        <button type="button" onClick={() => go(1)} aria-label={L('اسلاید بعدی', 'Next slide')}><ChevronRight size={15} /></button>
      </div>
    </section>
  );
}
