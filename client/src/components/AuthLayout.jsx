import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { LogoMark } from './Brand.jsx';
import { CandleChart } from './Art.jsx';
import { useLang } from '../lib/lang.jsx';

export default function AuthLayout({ title, subtitle, children, footer }) {
  const { L } = useLang();

  return (
    <div className="relative flex min-h-screen flex-col lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-e border-gold/10 bg-gradient-to-br from-[#0C0F12] via-[#07080A] to-[#120D06] p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 grid-glow opacity-40" />
        <div className="pointer-events-none absolute -start-24 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <CandleChart className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-25" height={260} />

        <Link to="/" className="relative flex items-center gap-3">
          <LogoMark size={46} />
          <div>
            <p className="gold-text text-lg font-extrabold tracking-[0.26em]">RENA</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-mute/60">TRADING COUPLE</p>
          </div>
        </Link>

        <div className="relative">
          <p className="chip-gold">{L('دو ذهن • یک چشم‌انداز', 'Two minds • one vision')}</p>
          <h2 className="mt-4 max-w-md text-3xl font-extrabold leading-tight">
            <span className="gold-text">{L('با هم، به سوی آزادی مالی', 'Together towards financial freedom')}</span>
          </h2>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-mute">
            {L(
              'کپی ترید، پراپ تریدینگ، طرح‌های درآمدی و پشتیبانی ۲۴/۷ در یک پلتفرم یکپارچه با گزارش شفاف.',
              'Copy trading, prop trading, income plans and 24/7 support in one platform with transparent reporting.',
            )}
          </p>
          <div className="mt-6 flex items-center gap-2 text-[11px] text-mute/70">
            <ShieldCheck size={14} className="text-gold" />
            {L('کنترل دسترسی و بررسی هر درخواست در بک‌اند', 'Access control and request review enforced in the backend')}
          </div>
        </div>

        <p className="relative text-[10px] uppercase tracking-[0.28em] text-mute/40">
          Trade together • Grow together
        </p>
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <LogoMark size={34} />
              <span className="gold-text text-sm font-extrabold tracking-[0.24em]">RENA</span>
            </Link>
            <Link to="/" className="text-[11px] text-mute hover:text-gold">
              {L('بازگشت به سایت', 'Back to site')}
            </Link>
          </div>

          <div className="panel p-6 sm:p-7">
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle ? <p className="mt-1.5 text-[12.5px] leading-relaxed text-mute">{subtitle}</p> : null}
            <div className="mt-6">{children}</div>
          </div>

          {footer ? <div className="mt-4 text-center text-[12.5px] text-mute">{footer}</div> : null}

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-mute/60 transition hover:text-gold"
          >
            <ArrowLeft size={12} className="ltr:rotate-180" />
            {L('بازگشت به صفحه اصلی', 'Back to home')}
          </Link>
        </div>
      </main>
    </div>
  );
}
