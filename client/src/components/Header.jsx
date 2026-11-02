import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Globe2, ChevronDown, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react';
import { Brand } from './Brand.jsx';
import { useLang } from '../lib/lang.jsx';
import { useAuth } from '../lib/auth.jsx';
import ReferenceArt from './ReferenceArt.jsx';

export const NAV_LINKS = [
  { to: '/', key: 'home', fa: 'صفحه اصلی', en: 'Home' },
  { to: '/services', key: 'services', fa: 'خدمات', en: 'Services' },
  { to: '/copy-trade', key: 'copy', fa: 'کپی ترید', en: 'Copy Trade' },
  { to: '/prop', key: 'prop', fa: 'پراپ', en: 'Prop' },
  { to: '/investment', key: 'invest', fa: 'سرمایه‌گذاری', en: 'Investment' },
  { to: '/loan', key: 'loan', fa: 'وام', en: 'Loan' },
  { to: '/about', key: 'about', fa: 'درباره ما', en: 'About' },
  { to: '/contact', key: 'contact', fa: 'تماس با ما', en: 'Contact' },
  { to: '/faq', key: 'faq', fa: 'سوالات متداول', en: 'FAQ' },
];

function LanguageSwitcher({ reference = false }) {
  const { lang, setLang, L } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-xs text-mute transition hover:border-gold/30 hover:text-white"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={L('تغییر زبان', 'Change language')}
      >
        {reference ? <span aria-hidden="true" className="text-lg">{lang === 'fa' ? '🇮🇷' : '🌐'}</span> : <Globe2 size={14} />}
        <span className="text-[11px] font-semibold">{lang === 'fa' ? 'FA' : 'EN'}</span>
        <ChevronDown size={12} />
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-gold/20 bg-panel p-1 shadow-panel">
          <button
            type="button"
            onClick={() => {
              setLang('fa');
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition hover:bg-white/5 ${
              lang === 'fa' ? 'text-gold' : 'text-mute'
            }`}
          >
            <span aria-hidden="true">🇮🇷</span> فارسی
          </button>
          <button
            type="button"
            onClick={() => {
              setLang('en');
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition hover:bg-white/5 ${
              lang === 'en' ? 'text-gold' : 'text-mute'
            }`}
          >
            <span aria-hidden="true">🌐</span> English
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Header({ onOpenMenu, reference = false }) {
  const { L } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`${reference ? 'reference-header' : ''} sticky top-0 z-50 border-b border-gold/10 bg-ink/85 backdrop-blur-xl`}>
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-3 sm:px-5">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg border border-white/10 p-2 text-mute transition hover:border-gold/30 hover:text-white lg:hidden"
          aria-label={L('منو', 'Menu')}
        >
          <Menu size={17} />
        </button>

        {reference ? <Link to="/" aria-label="RENA TRADING COUPLE"><ReferenceArt region="logo" className="h-11 w-11" /></Link> : <Brand />}

        <nav className="mx-2 hidden flex-1 items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.key}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              {L(link.fa, link.en)}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions ms-auto flex items-center gap-2">
          <LanguageSwitcher reference={reference} />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="hidden items-center gap-2 rounded-xl border border-gold/25 bg-gold/[0.07] px-3 py-2 text-xs font-medium text-gold transition hover:border-gold/50 sm:flex"
              >
                {user.role === 'ADMIN' ? <ShieldCheck size={14} /> : <LayoutDashboard size={14} />}
                {user.role === 'ADMIN' ? L('پنل مدیریت', 'Admin panel') : L('داشبورد', 'Dashboard')}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-white/10 p-2 text-mute transition hover:border-down/40 hover:text-down"
                aria-label={L('خروج', 'Log out')}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm sm:px-4 sm:py-2 sm:text-[13px]">
                {L('ورود', 'Login')}
              </Link>
              <Link to="/register" className="btn btn-gold btn-sm sm:px-4 sm:py-2 sm:text-[13px]">
                {L('ثبت نام', 'Register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
