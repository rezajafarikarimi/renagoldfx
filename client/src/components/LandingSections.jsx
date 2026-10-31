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
import { PhoneMockup, MomentumArt } from './Art.jsx';
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
    <section className="mt-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((card, index) => {
          const Icon = SERVICE_ICONS[card.icon] || Layers;
          return (
            <Link
              key={`${card.href}-${index}`}
              to={card.href || '/services'}
              className="panel panel-lift group relative flex flex-col justify-between overflow-hidden p-4"
            >
              <div className="absolute -end-8 -top-8 h-20 w-20 rounded-full bg-gold/[0.07] blur-2xl transition group-hover:bg-gold/[0.16]" />
              <div>
                <span className="inline-flex rounded-xl border border-gold/25 bg-gold/10 p-2.5 text-gold shadow-[inset_0_0_16px_rgba(232,182,78,0.08)]">
                  <Icon size={19} strokeWidth={1.6} />
                </span>
                <h3 className="mt-3 text-[13.5px] font-semibold text-white">{L(card.titleFa, card.titleEn)}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-mute/75">{L(card.descFa, card.descEn)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-mute/40">
                  {L('مشاهده', 'View')}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold/25 text-gold transition group-hover:border-gold/60 group-hover:bg-gold/10">
                  <ChevronLeft size={14} className="rtl:rotate-0 ltr:rotate-180" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function PromoPanels() {
  const { L } = useLang();

  return (
    <section className="mt-5 grid gap-3 xl:grid-cols-3">
      <div className="panel panel-lift relative overflow-hidden p-5">
        <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
        <p className="text-[10px] uppercase tracking-[0.24em] text-gold/70">{L('مزیت RENA', 'RENA advantage')}</p>
        <h3 className="mt-2 text-lg font-bold">{L('کپی ترید حرفه‌ای', 'Professional copy trading')}</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-mute/80">
          {L('از تجربه تریدرهای حرفه‌ای سود ببرید.', 'Benefit from the experience of professional traders.')}
        </p>
        <div className="my-4 flex justify-center">
          <PhoneMockup />
        </div>
        <Link to="/copy-trade" className="btn btn-ghost btn-sm w-full">
          {L('مشاهده بیشتر', 'View more')}
          <ArrowLeft size={13} className="ltr:rotate-180" />
        </Link>
      </div>

      <div className="panel panel-lift relative overflow-hidden p-5">
        <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gold/[0.07] blur-3xl" />
        <p className="text-[10px] uppercase tracking-[0.24em] text-gold/70">{L('اعتماد', 'Trust')}</p>
        <h3 className="mt-2 text-lg font-bold">{L('امنیت در اولویت', 'Security first')}</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-mute/80">
          {L('دارایی شما، مسئولیت ماست.', 'Your assets are our responsibility.')}
        </p>
        <div className="mt-4 space-y-2">
          <SecurityItem
            icon={KeyRound}
            title={L('رمزنگاری داده‌ها', 'Data encryption')}
            note={L('رمز عبور با bcrypt هش و نشست‌ها با توکن امضاشده مدیریت می‌شوند.', 'Passwords hashed with bcrypt, sessions managed with signed tokens.')}
            active
          />
          <SecurityItem
            icon={ShieldCheck}
            title={L('کنترل دسترسی سمت سرور', 'Server-side access control')}
            note={L('هر درخواست در بک‌اند بررسی می‌شود؛ پنهان‌سازی ظاهری کافی نیست.', 'Every request is authorized in the backend — not merely hidden in the UI.')}
            active
          />
          <SecurityItem
            icon={Radar}
            title={L('احراز هویت دو مرحله‌ای', 'Two-factor authentication')}
            note={L('در حال توسعه — تا فعال‌سازی، ورود با رمز عبور انجام می‌شود.', 'In development — login uses a password until it ships.')}
          />
        </div>
      </div>

      <div className="panel panel-lift relative overflow-hidden p-5">
        <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gold/[0.07] blur-3xl" />
        <p className="text-[10px] uppercase tracking-[0.24em] text-gold/70">{L('بازارها', 'Markets')}</p>
        <h3 className="mt-2 text-lg font-bold">{L('فرصت‌های معاملاتی در بازارهای جهانی', 'Global market opportunities')}</h3>
        <p className="mt-1.5 text-[12px] leading-relaxed text-mute/80">
          {L('کریپتو | فارکس | طلا | شاخص‌ها', 'Crypto | Forex | Gold | Indices')}
        </p>
        <MomentumArt className="my-3 h-[150px]" />
        <Link to="/register" className="btn btn-gold btn-sm w-full">
          {L('شروع کنید', 'Get started')}
        </Link>
      </div>
    </section>
  );
}

function SecurityItem({ icon: Icon, title, note, active }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
      <span className="mt-0.5 rounded-lg border border-gold/25 bg-gold/10 p-1.5 text-gold">
        <Icon size={14} strokeWidth={1.8} />
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
    <section className="panel relative mt-5 overflow-hidden p-5 sm:p-7">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-30" />
      <div className="relative flex flex-col gap-4 border-b border-white/[0.06] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-gold/70">RENA</p>
          <h2 className="mt-1.5 text-xl font-bold sm:text-2xl">{L('چرا RENA؟', 'Why RENA?')}</h2>
          <p className="mt-1.5 text-[12.5px] text-mute">
            {L('ترکیبی از تجربه، فناوری و اعتماد.', 'A combination of experience, technology and trust.')}
          </p>
        </div>
        <Link to="/about" className="btn btn-ghost btn-sm self-start md:self-auto">
          {L('درباره RENA', 'About RENA')}
        </Link>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {WHY.map((item) => (
          <div
            key={item.en[0]}
            className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-gold/35 hover:bg-gold/[0.04]"
          >
            <span className="rounded-lg border border-gold/25 bg-gold/10 p-2 text-gold transition group-hover:border-gold/50">
              <item.icon size={16} strokeWidth={1.7} />
            </span>
            <div>
              <p className="text-[13px] font-semibold">{L(item.fa[0], item.en[0])}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-mute/70">{L(item.fa[1], item.en[1])}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  const { L } = useLang();
  return (
    <section className="panel relative mt-5 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="chip-gold">
            <Sparkles size={11} />
            {L('شروع مسیر', 'Start your journey')}
          </p>
          <h2 className="mt-3 text-xl font-bold sm:text-2xl">
            {L('همین امروز حساب کاربری خود را بسازید', 'Create your account today')}
          </h2>
          <p className="mt-1.5 max-w-xl text-[12.5px] text-mute">
            {L(
              'دسترسی به کیف پول، درخواست سرمایه‌گذاری، پشتیبانی و گزارش‌های شفاف از همان ابتدا.',
              'Wallet, investment requests, support and transparent reporting from day one.',
            )}
          </p>
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
      <div className="relative mt-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-mute/50">
        <Users size={13} className="text-gold/60" />
        {L('دو ذهن • یک چشم‌انداز', 'Two minds • one vision')}
      </div>
    </section>
  );
}
