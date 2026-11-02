import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Gem,
  Wallet,
  TrendingUp,
  Activity,
  Gift,
  Users,
  ShieldCheck,
  LifeBuoy,
  PhoneCall,
  Headset,
  X,
  Layers,
  Settings,
  ScrollText,
  LogIn,
  ExternalLink,
} from 'lucide-react';
import { useLang } from '../lib/lang.jsx';
import { useAuth } from '../lib/auth.jsx';
import { LogoMark } from './Brand.jsx';
import { StatusBadge } from './ui.jsx';
import ReferenceArt from './ReferenceArt.jsx';

const USER_ITEMS = [
  { to: '/dashboard', end: true, icon: LayoutDashboard, fa: 'داشبورد', en: 'Dashboard' },
  { to: '/dashboard/profile', icon: User, fa: 'پروفایل', en: 'Profile' },
  { to: '/dashboard/plans', icon: Gem, fa: 'خرید طرح درآمدی', en: 'Income plans' },
  { to: '/dashboard/wallet', icon: Wallet, fa: 'کیف پول و تراکنش‌ها', en: 'Wallet & transactions' },
  { to: '/dashboard/investments', icon: TrendingUp, fa: 'درخواست سرمایه‌گذاری', en: 'Investment requests' },
  { to: '/dashboard/trading', icon: Activity, fa: 'ثبت ترید / پراپ', en: 'Trading / Prop' },
  { to: '/dashboard/referrals', icon: Gift, fa: 'کارمزد معرفی', en: 'Referral commission' },
  { to: '/dashboard/users', icon: Users, fa: 'کاربران شما', en: 'Your users' },
  { to: '/dashboard/security', icon: ShieldCheck, fa: 'تنظیمات امنیتی', en: 'Security settings' },
  { to: '/dashboard/support', icon: LifeBuoy, fa: 'پشتیبانی', en: 'Support' },
];

const ADMIN_ITEMS = [
  { to: '/admin', end: true, icon: LayoutDashboard, fa: 'داشبورد مدیریت', en: 'Admin overview' },
  { to: '/admin/users', icon: Users, fa: 'مدیریت کاربران', en: 'Users' },
  { to: '/admin/finance', icon: Wallet, fa: 'مالی و تراکنش‌ها', en: 'Finance & transactions' },
  { to: '/admin/plans', icon: Layers, fa: 'طرح‌ها و Pool1', en: 'Plans & Pool1' },
  { to: '/admin/support', icon: LifeBuoy, fa: 'تیکت‌های پشتیبانی', en: 'Support tickets' },
  { to: '/admin/content', icon: Settings, fa: 'محتوا و تنظیمات', en: 'Content & settings' },
  { to: '/admin/audit', icon: ScrollText, fa: 'گزارش رخدادها', en: 'Audit log' },
];

function ProfileCard({ variant }) {
  const { L } = useLang();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-[74px] animate-pulse rounded-xl border border-white/5 bg-white/[0.03]" />;
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/[0.08] to-transparent p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <User size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">{L('کاربر مهمان', 'Guest user')}</p>
            <p className="truncate text-[10.5px] text-mute/70">
              {L('برای دسترسی کامل وارد شوید', 'Sign in for full access')}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <Link to="/login" className="btn btn-ghost btn-sm w-full">
            {L('ورود', 'Login')}
          </Link>
          <Link to="/register" className="btn btn-gold btn-sm w-full">
            {L('ثبت نام', 'Register')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/[0.07] to-transparent p-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-b from-gold/25 to-gold/5 text-[13px] font-bold text-gold">
          {user.fullName?.slice(0, 1) || 'R'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">{user.fullName}</p>
          <p className="truncate text-[10.5px] text-mute/70">@{user.username}</p>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <StatusBadge status={user.kycStatus} />
        {variant === 'admin' ? (
          <span className="chip border-gold/30 bg-gold/10 text-[9px] text-gold">
            {L('مدیر', 'ADMIN')}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SidebarPanel({ variant, onNavigate, reference = false }) {
  const { L } = useLang();
  const { user } = useAuth();
  const items = variant === 'admin' ? ADMIN_ITEMS : USER_ITEMS;
  const supportHref = variant === 'admin' ? '/admin/support' : user ? '/dashboard/support' : '/contact';

  return (
    <div className="panel overflow-hidden">
      {reference ? <Link to="/" onClick={onNavigate} className="reference-sidebar-brand" aria-label="RENA TRADING COUPLE"><ReferenceArt region="logo" /></Link> : (
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-3">
          <LogoMark size={26} />
          <div className="leading-none">
            <p className="gold-text text-[11px] font-extrabold tracking-[0.22em]">RENA</p>
            <p className="mt-0.5 text-[8px] uppercase tracking-[0.24em] text-mute/60">
              {variant === 'admin' ? L('پنل مدیریت', 'Admin panel') : L('پنل کاربری', 'Member area')}
            </p>
          </div>
        </div>
      )}

      <div className="p-2.5">
        <ProfileCard variant={variant} />
      </div>

      <nav className="px-2 pb-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `side-link mb-0.5 ${isActive || (reference && item.to === '/dashboard') ? 'side-link-active' : ''}`}
          >
            <item.icon size={15} strokeWidth={1.7} className="shrink-0" />
            <span className="truncate">{L(item.fa, item.en)}</span>
          </NavLink>
        ))}
      </nav>

      {variant === 'admin' ? (
        <div className="px-2 pb-3">
          <Link to="/" onClick={onNavigate} className="side-link">
            <ExternalLink size={15} strokeWidth={1.7} />
            {L('مشاهده سایت', 'View website')}
          </Link>
        </div>
      ) : null}

      <div className="m-2.5 rounded-xl border border-gold/25 bg-gradient-to-br from-gold/[0.12] to-transparent p-3">
        <div className="flex items-center gap-2">
          <span className="rounded-lg border border-gold/30 bg-gold/10 p-1.5 text-gold">
            {reference ? <Headset size={14} /> : <PhoneCall size={14} />}
          </span>
          <div>
            <p className="text-[11.5px] font-semibold">{L('پشتیبانی آنلاین', 'Live support')}</p>
            <p className="text-[9.5px] text-mute/65">{L('۲۴ ساعت، ۷ روز هفته', '24 hours, 7 days')}</p>
          </div>
        </div>
        <Link to={supportHref} onClick={onNavigate} className="btn btn-ghost btn-sm mt-2.5 w-full">
          {L('تماس با ما', 'Contact us')}
        </Link>
      </div>
    </div>
  );
}

export default function Sidebar({ variant = 'public', open, onClose, reference = false }) {
  const { L } = useLang();

  return (
    <>
      <aside className="hidden w-[250px] shrink-0 py-6 lg:block">
        <div className="sticky top-[84px] max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
          <SidebarPanel variant={variant} reference={reference} />
        </div>
      </aside>

      {open ? (
        <div className={`${reference ? 'reference-drawer' : ''} fixed inset-0 z-[80] lg:hidden`}>
          <button
            type="button"
            aria-label="close menu"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 start-0 w-[268px] animate-fade-up overflow-y-auto bg-ink p-2.5 shadow-panel">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-[10px] uppercase tracking-[0.24em] text-mute/60">
                {L('منو', 'Menu')}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 p-1.5 text-mute"
                aria-label="close"
              >
                <X size={15} />
              </button>
            </div>

            <SidebarPanel variant={variant} reference={reference} onNavigate={onClose} />

            <div className="mt-3 rounded-xl border border-white/10 p-2">
              <p className="px-1 pb-1 text-[10px] uppercase tracking-[0.2em] text-mute/50">
                {L('صفحات سایت', 'Site pages')}
              </p>
              {[
                ['/', 'صفحه اصلی', 'Home'],
                ['/services', 'خدمات', 'Services'],
                ['/copy-trade', 'کپی ترید', 'Copy trade'],
                ['/prop', 'پراپ تریدینگ', 'Prop'],
                ['/investment', 'سرمایه‌گذاری', 'Investment'],
                ['/loan', 'وام', 'Loan'],
                ['/about', 'درباره ما', 'About'],
                ['/contact', 'تماس با ما', 'Contact'],
                ['/faq', 'سوالات متداول', 'FAQ'],
              ].map(([to, fa, en]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-[12px] text-mute hover:bg-white/5 hover:text-white"
                >
                  <LogIn size={12} className="opacity-40" />
                  {L(fa, en)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
