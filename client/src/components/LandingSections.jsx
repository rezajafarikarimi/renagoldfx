import { Link } from 'react-router-dom';
import { ChartNoAxesCombined, Coins, CandlestickChart, GraduationCap, HandCoins, ArrowRight, ShieldCheck, KeyRound, LockKeyhole, Headset, Gift, Users, TrendingUp } from 'lucide-react';
import ReferenceArt from './ReferenceArt.jsx';
import { useLang } from '../lib/lang.jsx';

const ICONS = { services: ChartNoAxesCombined, plans: Coins, copy: CandlestickChart, prop: GraduationCap, loan: HandCoins };

export function ServiceCards({ cards = [] }) {
  const { L } = useLang();
  return <section className="reference-services" aria-label={L('خدمات RENA', 'RENA services')}>
    {cards.map((card, i) => {
      const Icon = ICONS[card.icon] || ChartNoAxesCombined;
      return <Link key={`${card.href}-${i}`} to={card.href || '/services'} className="reference-service">
        <Icon className="reference-service-icon" size={34} strokeWidth={1.8} />
        <h2>{L(card.titleFa, card.titleEn)}</h2>
        <p>{L(card.descFa, card.descEn)}</p>
        <span className="reference-circle-arrow"><ArrowRight size={12} /></span>
      </Link>;
    })}
  </section>;
}

export function PromoPanels() {
  const { L } = useLang();
  return <section className="reference-promos" aria-label={L('مزایای RENA', 'RENA advantages')}>
    <article className="reference-promo reference-copy-promo">
      <ReferenceArt region="phone" className="reference-phone-art" />
      <div className="reference-promo-copy">
        <h2>{L('کپی ترید حرفه‌ای', 'Professional copy trading')}</h2>
        <p>{L('از تجربه تریدرهای حرفه‌ای سود ببرید.', 'Benefit from the experience of professional traders.')}</p>
        <Link to="/copy-trade" className="btn btn-gold btn-sm">{L('مشاهده بیشتر', 'View more')} <ArrowRight size={13} /></Link>
      </div>
    </article>
    <article className="reference-promo reference-security-promo">
      <ShieldCheck size={40} className="reference-security-shield" fill="currentColor" stroke="#5b360e" />
      <h2>{L('امنیت در اولویت', 'Security first')}</h2>
      <p>{L('دارایی شما، مسئولیت ماست.', 'Your assets are our responsibility.')}</p>
      <div className="reference-security-items">
        <div title={L('رمز عبور هش می‌شود و نشست‌ها با توکن امضاشده مدیریت می‌شوند.', 'Passwords are hashed and sessions use signed tokens.')}><KeyRound size={20}/><span>{L('رمزنگاری داده‌ها', 'Data encryption')}</span></div>
        <div title={L('هر درخواست در سرور بررسی می‌شود.', 'Every request is authorized on the server.')}><ShieldCheck size={20}/><span>{L('کنترل دسترسی', 'Access control')}</span></div>
        <div><LockKeyhole size={20}/><span>{L('ورود دو مرحله‌ای', 'Two-factor login')}</span><small>{L('در حال توسعه', 'Coming soon')}</small></div>
      </div>
    </article>
    <article className="reference-promo reference-markets-promo">
      <ReferenceArt region="markets" className="reference-markets-art" />
      <div className="reference-promo-copy">
        <h2>{L('فرصت‌های معاملاتی در بازارهای جهانی', 'Global market opportunities')}</h2>
        <p>{L('کریپتو | فارکس | طلا | شاخص‌ها', 'Crypto | Forex | Gold | Indices')}</p>
        <Link to="/register" className="btn btn-gold btn-sm">{L('شروع کنید', 'Get started')} <ArrowRight size={13}/></Link>
      </div>
    </article>
  </section>;
}

const WHY = [
  [Headset, 'پشتیبانی ۲۴/۷', '24/7 support', 'تیم حرفه‌ای و پاسخگو', 'A responsive, professional team'],
  [GraduationCap, 'آموزش و خدمات مالی', 'Education & financial services', 'همراه شما در مسیر موفقیت', 'Supporting your progress'],
  [Gift, 'کارمزد معرفی', 'Referral commission', 'درآمد پایدار و بلندمدت', 'Ongoing referral income'],
  [Users, 'سرمایه‌گذاری', 'Investment', 'طرح‌های درآمدی با شرایط شفاف', 'Income plans with clear terms'],
  [TrendingUp, 'پراپ تریدینگ', 'Prop trading', 'سرمایه برای تریدرها', 'Capital for traders'],
  [HandCoins, 'وام', 'Loan', 'تأمین سرمایه برای رشد بیشتر', 'Funding for further growth'],
];

export function WhyRena() {
  const { L } = useLang();
  return <section className="reference-why">
    <div className="reference-why-heading"><h2>{L('چرا RENA؟', 'Why RENA?')}</h2><p>{L('ترکیبی از تجربه، فناوری و اعتماد', 'Experience, technology and trust')}</p></div>
    {WHY.map(([Icon, fa, en, noteFa, noteEn]) => <div className="reference-why-item" key={en}><Icon size={26}/><h3>{L(fa, en)}</h3><p>{L(noteFa, noteEn)}</p></div>)}
  </section>;
}
