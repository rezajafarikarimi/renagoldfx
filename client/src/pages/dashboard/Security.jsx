import { useState } from 'react';
import { KeyRound, ShieldCheck, Monitor, History, LifeBuoy } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Badge,
  Button,
  Card,
  Field,
  LoadingBlock,
  PageHeader,
  Spinner,
  Table,
  useToast,
} from '../../components/ui.jsx';
import { post, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const ACTION_LABELS = {
  'auth.login': ['ورود موفق', 'Successful login'],
  'auth.register': ['ثبت نام', 'Registration'],
  'auth.logout': ['خروج', 'Logout'],
  'security.password_changed': ['تغییر رمز عبور', 'Password changed'],
};

export default function Security() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/me/security');
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.newPassword !== form.confirm) {
      setError(ERROR_LABELS.password_mismatch);
      return;
    }
    setBusy(true);
    try {
      await post('/me/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast(L('رمز عبور تغییر کرد.', 'Password updated.'));
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
      reload();
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Shell variant="user">
        <LoadingBlock />
      </Shell>
    );
  }

  const history = data?.history || [];

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('امنیت', 'Security')}
        title={L('تنظیمات امنیتی', 'Security settings')}
        description={L(
          'رمز عبور، نشست فعال و تاریخچه ورودهای حساب خود را مدیریت کنید.',
          'Manage your password, active session and sign-in history.',
        )}
      />

      <div className="grid gap-3 xl:grid-cols-[1.1fr_1fr]">
        <Card>
          <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
            <KeyRound size={15} className="text-gold" />
            {L('تغییر رمز عبور', 'Change password')}
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-3.5">
            <Field label={L('رمز عبور فعلی', 'Current password')}>
              <input
                className="input"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
                required
              />
            </Field>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label={L('رمز عبور جدید', 'New password')} hint={L('حداقل ۸ کاراکتر', 'At least 8 characters')}>
                <input
                  className="input"
                  type="password"
                  dir="ltr"
                  autoComplete="new-password"
                  value={form.newPassword}
                  onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
                  required
                />
              </Field>
              <Field label={L('تکرار رمز جدید', 'Confirm new password')}>
                <input
                  className="input"
                  type="password"
                  dir="ltr"
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(event) => setForm({ ...form, confirm: event.target.value })}
                  required
                />
              </Field>
            </div>

            {error ? (
              <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
            ) : null}

            <Button type="submit" variant="gold" className="w-full sm:w-auto" disabled={busy}>
              {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
              {L('ذخیره رمز جدید', 'Save new password')}
            </Button>
          </form>
        </Card>

        <div className="space-y-3">
          <Card>
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
              <ShieldCheck size={15} className="text-gold" />
              {L('احراز هویت دو مرحله‌ای', 'Two-factor authentication')}
            </h2>
            <div className="mt-2.5 flex items-center gap-2">
              <Badge tone={data?.twoFactorEnabled ? 'up' : 'mute'}>
                {data?.twoFactorEnabled ? L('فعال', 'Enabled') : L('غیرفعال', 'Disabled')}
              </Badge>
              <span className="text-[11px] text-mute/60">
                {L('در حال توسعه — هنوز فعال نشده است.', 'In development — not yet available.')}
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-mute/60">
              {L(
                'تا زمان انتشار، امنیت حساب با رمز عبور قوی، هش bcrypt و کنترل دسترسی سمت سرور تأمین می‌شود.',
                'Until it ships, account security relies on a strong password, bcrypt hashing and server-side access control.',
              )}
            </p>
            <Button to="/dashboard/support" variant="ghost" size="sm" className="mt-3">
              <LifeBuoy size={13} />
              {L('درخواست فعال‌سازی', 'Request activation')}
            </Button>
          </Card>

          <Card>
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Monitor size={15} className="text-gold" />
              {L('نشست فعال', 'Active session')}
            </h2>
            <div className="mt-2.5 space-y-1.5 text-[11.5px]">
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                <span className="text-mute">{L('شروع نشست', 'Session started')}</span>
                <span className="text-white/85">{formatDate(data?.session?.startedAt, lang)}</span>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                <span className="text-mute">IP</span>
                <span dir="ltr" className="truncate text-white/85">{data?.session?.ip || '—'}</span>
              </div>
              <div className="rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                <p className="text-mute">{L('دستگاه', 'Device')}</p>
                <p dir="ltr" className="mt-0.5 truncate text-[10.5px] text-white/70">
                  {data?.session?.userAgent || '—'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-3 overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <History size={14} className="text-gold" />
          <h2 className="text-[13px] font-semibold">{L('تاریخچه ورود', 'Login history')}</h2>
        </div>
        <Table
          rows={history}
          keyField="createdAt"
          columns={[
            {
              key: 'action',
              label: L('رخداد', 'Event'),
              render: (row) => {
                const label = ACTION_LABELS[row.action];
                return <span className="text-white/85">{label ? L(label[0], label[1]) : row.action}</span>;
              },
            },
            {
              key: 'createdAt',
              label: L('تاریخ', 'Date'),
              render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
            },
          ]}
          empty={
            <div className="py-8 text-center text-[12px] text-mute/70">
              {L('رخدادی ثبت نشده است.', 'No events recorded.')}
            </div>
          }
        />
      </Card>
    </Shell>
  );
}
