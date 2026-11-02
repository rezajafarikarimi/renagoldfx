import { Link } from 'react-router-dom';

import Shell from '../components/Shell.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import { ServiceCards, PromoPanels, WhyRena } from '../components/LandingSections.jsx';
import '../reference-theme.css';
import { useApi } from '../lib/api.js';
import { useLang } from '../lib/lang.jsx';

export default function Landing() {
  const { data } = useApi('/public/site');
  const { L } = useLang();

  return (
    <Shell variant="public" reference>
      <HeroSlider />
      <ServiceCards cards={data?.serviceCards || []} />
      <PromoPanels />
      <WhyRena />

      {data?.announcement ? <p className="reference-announcement">{data.announcement}</p> : null}
      <p className="reference-market-note">
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
