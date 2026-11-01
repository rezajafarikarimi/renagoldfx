import { Link } from 'react-router-dom';
import { Send, Youtube, Instagram, Twitter } from 'lucide-react';
import { LogoMark } from './Brand.jsx';
import { MountainScene } from './Art.jsx';
import { GoldDivider } from './Ornament.jsx';
import { useLang } from '../lib/lang.jsx';

const LEGAL = [
  { to: '/privacy', fa: 'حریم خصوصی', en: 'Privacy policy' },
  { to: '/terms', fa: 'قوانین و شرایط', en: 'Terms & conditions' },
  { to: '/risk', fa: 'افشای ریسک', en: 'Risk disclosure' },
];

const LINKS = [
  { to: '/services', fa: 'خدمات', en: 'Services' },
  { to: '/copy-trade', fa: 'کپی ترید', en: 'Copy trade' },
  { to: '/prop', fa: 'پراپ تریدینگ', en: 'Prop trading' },
  { to: '/investment', fa: 'سرمایه‌گذاری', en: 'Investment' },
  { to: '/loan', fa: 'وام', en: 'Loan' },
];

export default function Footer() {
  const { L } = useLang();

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-gold/25 bg-[#050506]">
      <MountainScene className="pointer-events-none absolute inset-x-0 bottom-0 h-[230px] w-full opacity-40" />
      <div className="gold-rule absolute inset-x-0 top-0 h-px" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-7 pt-9 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark size={40} />
              <div>
                <p className="gold-text text-base font-extrabold tracking-[0.24em]">RENA</p>
                <p className="text-[9px] uppercase tracking-[0.28em] text-gold/50">TRADING COUPLE</p>
              </div>
            </div>
            <p className="mt-3 max-w-sm text-[12.5px] leading-relaxed text-mute/85">
              {L(
                'با هم، به سوی آزادی مالی — پلتفرم معاملاتی RENA با زیرساخت امن، گزارش شفاف و پشتیبانی همیشگی.',
                'Together towards financial freedom — the RENA trading platform with a secure infrastructure, transparent reporting and constant support.',
              )}
            </p>
            <p className="font-script mt-3 text-[22px] leading-tight text-gold/85">Two Minds · One Vision</p>
            <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-mute/45">
              Trade together • Grow together
            </p>

            <div className="mt-4 flex items-center gap-2">
              {[
                { href: 'https://t.me/rena', icon: Send, label: 'Telegram' },
                { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
                { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                { href: 'https://x.com', icon: Twitter, label: 'X' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-black/40 text-gold/70 transition hover:border-gold/60 hover:text-gold"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-gold/80">
              {L('خدمات', 'Services')}
            </p>
            <ul className="space-y-2">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[12px] text-mute/85 transition hover:text-gold">
                    {L(link.fa, link.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-gold/80">
              {L('قوانین', 'Legal')}
            </p>
            <ul className="space-y-2">
              {LEGAL.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-[12px] text-mute/85 transition hover:text-gold">
                    {L(link.fa, link.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-gold/80">
              {L('ارتباط', 'Contact')}
            </p>
            <ul className="space-y-2 text-[12px] text-mute/85">
              <li>support@rena.gold</li>
              <li dir="ltr">+98 21 0000 0000</li>
              <li>
                <Link to="/contact" className="text-gold/80 transition hover:text-gold">
                  {L('فرم تماس و پشتیبانی', 'Contact & support')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <GoldDivider className="mt-8" />

        <div className="mt-4 flex flex-col gap-2 text-[10.5px] text-mute/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RENA TRADING COUPLE. {L('تمام حقوق محفوظ است.', 'All rights reserved.')}</p>
          <p className="max-w-xl leading-relaxed">
            {L(
              'معامله در بازارهای مالی ریسک از دست دادن سرمایه دارد. عملکرد گذشته تضمینی برای آینده نیست.',
              'Trading financial markets involves risk of loss. Past performance does not guarantee future results.',
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
