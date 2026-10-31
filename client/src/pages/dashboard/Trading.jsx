import { useState } from 'react';
import { Activity, Copy, Trophy } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  Field,
  LoadingBlock,
  PageHeader,
  Spinner,
  StatusBadge,
  Table,
  useToast,
} from '../../components/ui.jsx';
import { post, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function Trading() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/me/trading');
  const [form, setForm] = useState({ service: 'PROP', accountRef: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const activities = data?.activities || [];

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await post('/me/trading', form);
      toast(L('درخواست شما ثبت شد و در انتظار بررسی است.', 'Your request was submitted for review.'), 'info');
      setForm({ service: 'PROP', accountRef: '', notes: '' });
      reload();
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('معاملات', 'Trading')}
        title={L('ثبت ترید / پراپ', 'Trading / Prop')}
        description={L(
          'حساب پراپ یا کپی ترید خود را ثبت کنید تا تیم RENA آن را بررسی و فعال‌سازی کند.',
          'Register your prop or copy-trade account so the RENA team can review and activate it.',
        )}
      />

      <div className="grid gap-3 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <form onSubmit={submit} className="space-y-3.5">
            <Field label={L('نوع سرویس', 'Service')}>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'PROP', label: L('پراپ تریدینگ', 'Prop trading'), icon: Trophy },
                  { value: 'COPY', label: L('کپی ترید', 'Copy trading'), icon: Copy },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, service: option.value })}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[12px] transition ${
                      form.service === option.value
                        ? 'border-gold/50 bg-gold/10 text-gold'
                        : 'border-white/10 text-mute hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <option.icon size={14} />
                    {option.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label={L('شناسه حساب معاملاتی', 'Trading account ID')}>
              <input
                className="input"
                dir="ltr"
                value={form.accountRef}
                onChange={(event) => setForm({ ...form, accountRef: event.target.value })}
                placeholder="MT5-12345678"
                required
              />
            </Field>

            <Field label={L('یادداشت (اختیاری)', 'Note (optional)')}>
              <textarea
                className="input min-h-[90px]"
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder={L('سطح ریسک، سابقه معاملاتی یا هر توضیح دیگر', 'Risk level, track record or anything else')}
              />
            </Field>

            {error ? (
              <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
            ) : null}

            <Button type="submit" variant="gold" className="w-full" disabled={busy}>
              {busy ? <Spinner className="h-3.5 w-3.5" /> : <Activity size={15} />}
              {L('ثبت درخواست', 'Submit request')}
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-[13px] font-semibold">{L('درخواست‌های ثبت‌شده', 'Submitted requests')}</h2>
          </div>
          {loading ? (
            <LoadingBlock />
          ) : (
            <Table
              rows={activities}
              columns={[
                {
                  key: 'service',
                  label: L('سرویس', 'Service'),
                  render: (row) => (
                    <span className="text-white/85">
                      {row.service === 'PROP' ? L('پراپ تریدینگ', 'Prop trading') : L('کپی ترید', 'Copy trading')}
                    </span>
                  ),
                },
                {
                  key: 'accountRef',
                  label: L('شناسه حساب', 'Account'),
                  render: (row) => <span dir="ltr" className="text-[11.5px] text-mute">{row.accountRef || '—'}</span>,
                },
                { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
                {
                  key: 'createdAt',
                  label: L('تاریخ', 'Date'),
                  render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
                },
              ]}
              empty={
                <div className="py-8 text-center text-[12px] text-mute/70">
                  {L('هنوز درخواستی ثبت نکرده‌اید.', 'No requests submitted yet.')}
                </div>
              }
            />
          )}
        </Card>
      </div>
    </Shell>
  );
}
