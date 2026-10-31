import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import Shell from '../components/Shell.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import { ServiceCards, PromoPanels, WhyRena, CtaBand } from '../components/LandingSections.jsx';
import { useApi } from '../lib/api.js';
import { useLang } from '../lib/lang.jsx';

export default function Landing() {
  const { data } = useApi('/public/site');
  const { L } = useLang();

  return (
    <Shell variant="public">
      {data?.announcement ? (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/[0.06] px-3.5 py-2.5 text-[11.5px] text-gold/90">
          <Megaphone size={13} className="shrink-0" />
          <p className="leading-relaxed">{data.announcement}</p>
        </div>
      ) : null}

      <HeroSlider />
      <ServiceCards cards={data?.serviceCards || []} />
      <PromoPanels />
      <WhyRena />
      <CtaBand />

      <p className="mt-5 text-center text-[10px] leading-relaxed text-mute/40">
        {L(
          'قیمت‌های نوار بازار از منابع عمومی دریافت می‌شوند و در صورت قطع اتصال با برچسب «داده نمایشی» نمایش داده می‌شوند.',
          'Market bar prices come from public sources and are labelled “demo data” whenever the connection is unavailable.',
        )}{' '}
        <Link to="/risk" className="text-gold/60 hover:text-gold">
          {L('افشای ریسک', 'Risk disclosure')}
        </Link>
      </p>
    </Shell>
  );
}
