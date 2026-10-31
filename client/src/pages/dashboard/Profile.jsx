import { useEffect, useState } from 'react';
import { BadgeCheck, Mail, Phone, User } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  Field,
  PageHeader,
  Spinner,
  StatusBadge,
  useToast,
} from '../../components/ui.jsx';
import { formatDate, patch, ERROR_LABELS } from '../../lib/api.js';
import { useAuth } from '../../lib/auth.jsx';
import { useLang } from '../../lib/lang.jsx';

export default function Profile() {
  const { L, lang } = useLang();
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || '', phone: user.phone || '' });
  }, [user]);

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await patch('/me/profile', { fullName: form.fullName, phone: form.phone, email: user.email });
      await refresh();
      toast(L('اطلاعات پروفایل ذخیره شد.', 'Profile saved.'));
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('پروفایل', 'Profile')}
        title={L('اطلاعات حساب کاربری', 'Account information')}
        description={L('اطلاعات شخصی و وضعیت احراز هویت خود را مدیریت کنید.', 'Manage your personal details and verification status.')}
      />

      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={L('نام و نام خانوادگی', 'Full name')}>
                <input
                  className="input"
                  value={form.fullName}
                  onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                  required
                />
              </Field>
              <Field label={L('شماره تماس', 'Phone')}>
                <input
                  className="input"
                  dir="ltr"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </Field>
              <Field label={L('ایمیل', 'Email')} hint={L('تغییر ایمیل از طریق پشتیبانی انجام می‌شود.', 'Email changes are handled by support.')}>
                <input className="input opacity-70" dir="ltr" value={user.email} readOnly />
              </Field>
              <Field label={L('نام کاربری', 'Username')}>
                <input className="input opacity-70" dir="ltr" value={user.username} readOnly />
              </Field>
            </div>

            {error ? (
              <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
            ) : null}

            <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-4">
              <p className="text-[11px] text-mute/60">
                {L('عضویت از', 'Member since')} {formatDate(user.createdAt, lang, false)}
              </p>
              <Button type="submit" variant="gold" disabled={busy}>
                {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
                {L('ذخیره تغییرات', 'Save changes')}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-3">
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gradient-to-b from-gold/25 to-gold/5 text-base font-bold text-gold">
                {user.fullName?.slice(0, 1) || 'R'}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.fullName}</p>
                <p className="truncate text-[11px] text-mute/70">@{user.username}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[12px]">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-2.5 py-2">
                <span className="flex items-center gap-1.5 text-mute">
                  <Mail size={13} /> {L('ایمیل', 'Email')}
                </span>
                <span className="truncate text-white/85" dir="ltr">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-2.5 py-2">
                <span className="flex items-center gap-1.5 text-mute">
                  <Phone size={13} /> {L('تماس', 'Phone')}
                </span>
                <span dir="ltr" className="text-white/85">
                  {user.phone || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-2.5 py-2">
                <span className="flex items-center gap-1.5 text-mute">
                  <User size={13} /> {L('نقش', 'Role')}
                </span>
                <span className="text-white/85">{user.role === 'ADMIN' ? L('مدیر', 'Administrator') : L('کاربر', 'User')}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
              <BadgeCheck size={15} className="text-gold" />
              {L('وضعیت احراز هویت', 'Verification status')}
            </h2>
            <div className="mt-2.5 flex items-center gap-2">
              <StatusBadge status={user.kycStatus} />
              <span className="text-[11px] text-mute/60">
                {user.kycStatus === 'VERIFIED'
                  ? L('دسترسی کامل به سرویس‌ها', 'Full access to services')
                  : L('برای ارتقا، تیکت پشتیبانی ثبت کنید.', 'Open a support ticket to upgrade.')}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
