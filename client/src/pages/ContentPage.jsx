import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Copy,
  Trophy,
  Gem,
  Landmark,
  Headset,
  GraduationCap,
  Search,
  ShieldCheck,
  LineChart,
  Clock,
  Target,
  Wallet,
  CheckCircle2,
  Users,
  Lock,
  Mail,
  Phone,
  Send,
  ChevronDown,
} from 'lucide-react';
import Shell from '../components/Shell.jsx';
import { Button, Card, useToast } from '../components/ui.jsx';
import { contentPages } from '../lib/content.js';
import { useApi } from '../lib/api.js';
import { useLang } from '../lib/lang.jsx';

const ICONS = {
  copy: Copy,
  prop: Trophy,
  plans: Gem,
  loan: Landmark,
  support: Headset,
  education: GraduationCap,
  search: Search,
  shield: ShieldCheck,
  chart: LineChart,
  clock: Clock,
  target: Target,
  split: Users,
  wallet: Wallet,
  check: CheckCircle2,
  users: Users,
  lock: Lock,
};

function ContactInfo() {
  const { L } = useLang();
  const { data } = useApi('/public/site');
  const toast = useToast();
  const contact = data?.contact || {};

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast(L('کپی شد', 'Copied'), 'info');
    } catch {
      toast(L('کپی ممکن نشد', 'Could not copy'), 'error');
    }
  };

  return (
    <Card className="mt-4">
      <h2 className="text-sm font-semibold">{L('راه‌های ارتباطی', 'Contact channels')}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => contact.email && copy(contact.email)}
          className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-start text-[12.5px] text-mute transition hover:border-gold/30 hover:text-white"
        >
          <Mail size={15} className="text-gold" />
          <span dir="ltr">{contact.email || 'support@rena.gold'}</span>
        </button>
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[12.5px] text-mute">
          <Phone size={15} className="text-gold" />
          <span dir="ltr">{contact.phone || '+98 21 0000 0000'}</span>
        </div>
        <a
          href={contact.telegram || 'https://t.me/rena'}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[12.5px] text-mute transition hover:border-gold/30 hover:text-white"
        >
          <Send size={15} className="text-gold" />
          Telegram
        </a>
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[12.5px] text-mute">
          <Clock size={15} className="text-gold" />
          {contact.hours || L('پشتیبانی ۲۴ ساعته', '24/7 support')}
        </div>
      </div>
    </Card>
  );
}

export default function ContentPage({ id }) {
  const { L } = useLang();
  const page = contentPages[id];
  const [openFaq, setOpenFaq] = useState(0);

  if (!page) return null;

  return (
    <Shell variant="public">
      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 grid-glow opacity-30" />
        <div className="pointer-events-none absolute -end-16 -top-16 h-52 w-52 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold/70">
            {L(page.eyebrow.fa, page.eyebrow.en)}
          </p>
          <h1 className="mt-2.5 text-2xl font-extrabold leading-tight sm:text-3xl">
            <span className="gold-text">{L(page.title.fa, page.title.en)}</span>
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-mute sm:text-sm">
            {L(page.intro.fa, page.intro.en)}
          </p>
          {page.cta ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <Button to={page.cta.href} variant="gold">
                {L(page.cta.label.fa, page.cta.label.en)}
              </Button>
              <Button to="/contact" variant="ghost">
                {L('تماس با ما', 'Contact us')}
              </Button>
            </div>
          ) : null}
        </div>
      </section>

      {page.faq ? (
        <div className="mt-4 space-y-2">
          {page.faq.map((item, index) => {
            const open = openFaq === index;
            return (
              <div key={index} className="panel overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start text-[13px] font-medium transition hover:bg-white/[0.02]"
                >
                  {L(item.q.fa, item.q.en)}
                  <ChevronDown
                    size={15}
                    className={`shrink-0 text-gold/70 transition ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open ? (
                  <p className="border-t border-white/[0.06] px-4 py-3.5 text-[12.5px] leading-relaxed text-mute">
                    {L(item.a.fa, item.a.en)}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(page.items || []).map((item, index) => {
            const Icon = ICONS[item.icon] || ShieldCheck;
            return (
              <Card key={index} className="panel-lift">
                <span className="inline-flex rounded-xl border border-gold/25 bg-gold/10 p-2.5 text-gold">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <h2 className="mt-3 text-[13.5px] font-semibold">{L(item.title.fa, item.title.en)}</h2>
                <p className="mt-1.5 text-[12px] leading-relaxed text-mute/80">{L(item.body.fa, item.body.en)}</p>
              </Card>
            );
          })}
        </div>
      )}

      {id === 'contact' ? <ContactInfo /> : null}

      {page.cta ? (
        <div className="panel mt-4 flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-semibold">{L('هنوز سوالی دارید؟', 'Still have questions?')}</p>
            <p className="mt-1 text-[12px] text-mute">
              {L('تیم پشتیبانی RENA در تمام ساعات پاسخگوی شماست.', 'The RENA support team is available around the clock.')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button to="/faq" variant="ghost" size="sm">
              {L('سوالات متداول', 'FAQ')}
            </Button>
            <Button to={page.cta.href} variant="gold" size="sm">
              {L(page.cta.label.fa, page.cta.label.en)}
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-[11px] text-mute/50">
          {L('این صفحه اطلاعات عمومی است و مشاوره مالی محسوب نمی‌شود.', 'This page is general information, not financial advice.')}{' '}
          <Link to="/risk" className="text-gold/70 hover:text-gold">
            {L('افشای ریسک', 'Risk disclosure')}
          </Link>
        </p>
      )}
    </Shell>
  );
}
