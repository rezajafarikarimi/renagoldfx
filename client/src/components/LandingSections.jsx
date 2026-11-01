import { Link } from 'react-router-dom';
import {
  Layers,
  Gem,
  Copy,
  Trophy,
  Landmark,
  ChevronLeft,
  ShieldCheck,
  KeyRound,
  Radar,
  ArrowLeft,
  Gift,
  GraduationCap,
  Headset,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react';
import { PhoneMockup, BullArt } from './Art.jsx';
import { CornerFrame, GoldDivider } from './Ornament.jsx';
import { useLang } from '../lib/lang.jsx';

const SERVICE_ICONS = {
  services: Layers,
  plans: Gem,
  copy: Copy,
  prop: Trophy,
  loan: Landmark,
};

export function ServiceCards({ cards = [] }) {
  const { L } = useLang();
  if (!cards.length) return null;

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, index) => {
          const Icon = SERVICE_ICONS[card.icon] || Layers;
          return (
            <Link
              key={`${card.href}-${index}`}
              to={card.href || '/services'}
              className="ornate-panel group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gold/20 px-4 py-6 text-center transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold"
            >
              <CornerFrame />
              <span className="pointer-events-none absolute -top-16 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition group-hover:bg-gold/20" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black/40 shadow-[inset_0_0_18px_rgba(232,182,78,0.1)]">
                <span className="absolute inset-[5px] rounded-full border border-gold/20" />
                <Icon size={22} strokeWidth={1.5} className="text-gold" />
              </span>
              <h3 className="mt-3.5 text-[13.5px] font-bold text-gold">{L(card.titleFa, card.titleEn)}</h3>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-mute/70">{L(card.descFa, card.descEn)}</p>
              <span className="mt-4 inline-flex items-center gap-1 border-b border-gold/30 pb-0.5 text-[9.5px] uppercase tracking-[0.18em] text-gold/80 transition group-hover:border-gold/70 group-hover:text-gold">
                {L('مشاهده', 'View')}
                <ChevronLeft size={11} className="ltr:rotate-180" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PromoShell({ children, className = '' }) {
  return (
    <div className={`ornate-panel panel relative overflow-hidden p-5 ${className}`}>
      <CornerFrame />
      <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function PromoPanels() {
  const { L } = useLang();

  return (
    <section className="mt-4 grid gap-3 xl:grid-cols-3">
      <PromoShell>
        <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold/60">{L('بازارها', 'Markets')}</p>
        <h3 className="font-serif-gold mt-2 text-xl font-semibold text-gold">
          {L('فرصت‌های معاملاتی در بازارهای جهانی', 'Global market opportunities')}
        </h3>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-mute/75">
          {L('کریپتو | فارکس | طلا | شاخص‌ها', 'Crypto | Forex | Gold | Indices')}
        </p>
        <BullArt className="mx-auto my-2 h-[150px] w-full max-w-[330px]" />
        <Link to="/register" className="btn btn-gold btn-sm w-full">
          {L('شروع کنید', 'Get started')}
        </Link>
      </PromoShell>

      <PromoShell>
        <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold/60">{L('اعتماد', 'Trust')}</p>
        <h3 className="font-serif-gold mt-2 text-xl font-semibold text-gold">{L('امنیت در اولویت', 'Security first')}</h3>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-mute/75">
          {L('دارایی شما، مسئولیت ماست.', 'Your assets are our responsibility.')}
        </p>
        <div className="mt-4 space-y-2">
          <SecurityItem
            icon={KeyRound}
            title={L('رمزنگاری داده‌ها', 'Data encryption')}
            note={L(
              'رمز عبور با bcrypt هش و نشست‌ها با توکن امضاشده مدیریت می‌شوند.',
              'Passwords hashed with bcrypt, sessions managed with signed tokens.',
            )}
            active
          />
          <SecurityItem
            icon={ShieldCheck}
            title={L('کنترل دسترسی سمت سرور', 'Server-side access control')}
            note={L(
              'هر درخواست در بک‌اند بررسی می‌شود؛ پنهان‌سازی ظاهری کافی نیست.',
              'Every request is authorized in the backend — not merely hidden in the UI.',
            )}
            active
          />
          <SecurityItem
            icon={Radar}
            title={L('احراز هویت دو مرحله‌ای', 'Two-factor authentication')}
            note={L(
              'در حال توسعه — تا فعال‌سازی، ورود با رمز عبور انجام می‌شود.',
              'In development — login uses a password until it ships.',
            )}
          />
        </div>
      </PromoShell>

      <PromoShell>
        <p className="text-[9.5px] uppercase tracking-[0.28em] text-gold/60">{L('مزیت RENA', 'RENA advantage')}</p>
        <h3 className="font-serif-gold mt-2 text-xl font-semibold text-gold">
          {L('کپی ترید حرفه‌ای', 'Professional copy trading')}
        </h3>
        <p className="mt-1.5 text-[11.5px] leading-relaxed text-mute/75">
          {L('از تجربه تریدرهای حرفه‌ای سود ببرید.', 'Benefit from the experience of professional traders.')}
        </p>
        <div className="my-4 flex justify-center">
          <PhoneMockup />
        </div>
        <Link to="/copy-trade" className="btn btn-ghost btn-sm w-full">
          {L('مشاهده بیشتر', 'View more')}
          <ArrowLeft size={13} className="ltr:rotate-180" />
        </Link>
      </PromoShell>
    </section>
  );
}

function SecurityItem({ icon: Icon, title, note, active }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-gold/10 bg-black/30 p-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
        <Icon size={14} strokeWidth={1.7} />
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-white/90">{title}</p>
        <p className="mt-0.5 text-[10.5px] leading-relaxed text-mute/65">{note}</p>
      </div>
      {!active ? (
        <span className="ms-auto shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[9px] text-mute/70">
          soon
        </span>
      ) : null}
    </div>
  );
}

const WHY = [
  {
    icon: Landmark,
    fa: ['وام', 'تأمین سرمایه برای رشد با شرایط شفاف و بررسی وضعیت حساب.'],
    en: ['Loan', 'Capital funding to grow, with clear terms and account review.'],
  },
  {
    icon: Trophy,
    fa: ['پراپ تریدینگ', 'چالش‌های واقعی با قوانین مشخص و حساب اختصاصی.'],
    en: ['Prop trading', 'Real challenges with defined rules and a dedicated account.'],
  },
  {
    icon: TrendingUp,
    fa: ['سرمایه‌گذاری', 'طرح‌های درآمدی با بازه زمانی و هدف بازدهی مشخص.'],
    en: ['Investment', 'Income plans with a defined duration and return target.'],
  },
  {
    icon: Gift,
    fa: ['کارمزد معرفی', 'درآمد پایدار از شبکه معرفی و گزارش کمیسیون شفاف.'],
    en: ['Referral commission', 'Ongoing income from your referral network with clear commission reporting.'],
  },
  {
    icon: GraduationCap,
    fa: ['آموزش و خدمات مالی', 'محتوای ساختاریافته برای مدیریت ریسک و تحلیل بازار.'],
    en: ['Education & financial services', 'Structured content on risk management and market analysis.'],
  },
  {
    icon: Headset,
    fa: ['پشتیبانی ۲۴/۷', 'تیکت داخلی با پیگیری وضعیت و پاسخ کارشناس.'],
    en: ['24/7 support', 'Internal ticketing with status tracking and specialist replies.'],
  },
];

export function WhyRena() {
  const { L } = useLang();

  return (
    <section className="relative mt-8">
      <GoldDivider label="Why RENA" />
      <div className="mt-4 text-center">
        <h2 className="gold-text text-2xl font-extrabold sm:text-3xl">{L('چرا RENA؟', 'Why RENA?')}</h2>
        <p className="mt-1.5 text-[12px] text-mute/75">
          {L('ترکیبی از تجربه، فناوری و اعتماد.', 'A combination of experience, technology and trust.')}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-6">
        {WHY.map((item) => (
          <div key={item.en[0]} className="group flex flex-col items-center text-center">
            <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full border border-gold/35 bg-black/60 transition group-hover:border-gold/70 group-hover:shadow-gold">
              <span className="absolute inset-[5px] rounded-full border border-gold/15" />
              <span className="absolute -inset-2 rounded-full bg-gold/[0.06] opacity-0 blur-md transition group-hover:opacity-100" />
              <item.icon size={21} strokeWidth={1.5} className="relative text-gold" />
            </span>
            <p className="mt-3 text-[12.5px] font-semibold text-gold">{L(item.fa[0], item.en[0])}</p>
            <p className="mt-1.5 max-w-[190px] text-[10px] leading-relaxed text-mute/60">{L(item.fa[1], item.en[1])}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  const { L } = useLang();
  return (
    <section className="ornate-panel panel relative mt-8 overflow-hidden p-6 sm:p-9">
      <CornerFrame />
      <div className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="chip-gold">
            <Sparkles size={11} />
            {L('شروع مسیر', 'Start your journey')}
          </p>
          <h2 className="gold-text mt-3 text-2xl font-extrabold sm:text-3xl">
            {L('همین امروز حساب کاربری خود را بسازید', 'Create your account today')}
          </h2>
          <p className="mt-1.5 max-w-xl text-[12.5px] text-mute">
            {L(
              'دسترسی به کیف پول، درخواست سرمایه‌گذاری، پشتیبانی و گزارش‌های شفاف از همان ابتدا.',
              'Wallet, investment requests, support and transparent reporting from day one.',
            )}
          </p>
          <p className="font-script mt-3 text-2xl text-gold/80">Trade Together · Grow Together</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/register" className="btn btn-gold">
            {L('ثبت نام', 'Register')}
          </Link>
          <Link to="/faq" className="btn btn-ghost">
            {L('سوالات متداول', 'FAQ')}
          </Link>
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-gold/50">
        <Users size={13} />
        {L('دو ذهن • یک چشم‌انداز', 'Two minds • one vision')}
      </div>
    </section>
  );
}
