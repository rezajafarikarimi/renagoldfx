import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon, Landmark } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  Field,
  LoadingBlock,
  Money,
  PageHeader,
  Spinner,
  Stat,
  StatusBadge,
  Table,
  Tabs,
  useToast,
} from '../../components/ui.jsx';
import { post, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const KIND_LABELS = {
  DEPOSIT: ['واریز', 'Deposit'],
  WITHDRAWAL: ['برداشت', 'Withdrawal'],
  INVESTMENT: ['سرمایه‌گذاری', 'Investment'],
  COMMISSION: ['کمیسیون', 'Commission'],
  ADJUSTMENT: ['تعدیل', 'Adjustment'],
};

const METHODS = [
  ['USDT', 'USDT (TRC20)'],
  ['BTC', 'Bitcoin'],
  ['BANK', 'Bank transfer'],
];

export default function Wallet() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/me/wallet');
  const [tab, setTab] = useState('deposit');
  const [deposit, setDeposit] = useState({ amount: '', method: 'USDT', txRef: '' });
  const [withdraw, setWithdraw] = useState({ amount: '', destination: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const wallet = data?.wallet || { balance: 0, available: 0 };
  const transactions = data?.transactions || [];
  const deposits = data?.deposits || [];
  const withdrawals = data?.withdrawals || [];

  const submitDeposit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await post('/me/deposits', { ...deposit, amount: Number(deposit.amount) });
      toast(L('درخواست واریز ثبت شد و در انتظار بررسی است.', 'Deposit request submitted for review.'), 'info');
      setDeposit({ amount: '', method: 'USDT', txRef: '' });
      reload();
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await post('/me/withdrawals', { ...withdraw, amount: Number(withdraw.amount) });
      toast(L('درخواست برداشت ثبت شد؛ مبلغ تا بررسی رزرو شد.', 'Withdrawal requested; funds reserved until review.'), 'info');
      setWithdraw({ amount: '', destination: '' });
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

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('کیف پول', 'Wallet')}
        title={L('کیف پول و تراکنش‌ها', 'Wallet & transactions')}
        description={L(
          'درخواست واریز و برداشت ثبت کنید و سابقه کامل تراکنش‌ها را ببینید.',
          'Submit deposit and withdrawal requests and review your full transaction history.',
        )}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label={L('موجودی کل', 'Total balance')} value={<Money value={wallet.balance} className="text-xl" />} icon={WalletIcon} />
        <Stat label={L('قابل استفاده', 'Available')} value={<Money value={wallet.available} className="text-xl" />} icon={ArrowDownLeft} />
        <Stat label={L('واریز در انتظار', 'Pending deposits')} value={<span className="tabular-nums">{deposits.filter((d) => d.status === 'PENDING').length}</span>} icon={ArrowDownLeft} tone="mute" />
        <Stat label={L('برداشت در انتظار', 'Pending withdrawals')} value={<span className="tabular-nums">{withdrawals.filter((d) => d.status === 'PENDING').length}</span>} icon={ArrowUpRight} tone="mute" />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1fr_1.35fr]">
        <Card>
          <Tabs
            value={tab}
            onChange={(value) => {
              setTab(value);
              setError('');
            }}
            tabs={[
              { value: 'deposit', label: L('واریز', 'Deposit') },
              { value: 'withdraw', label: L('برداشت', 'Withdrawal') },
            ]}
          />

          {error ? (
            <p className="mb-3 rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
          ) : null}

          {tab === 'deposit' ? (
            <form onSubmit={submitDeposit} className="space-y-3.5">
              <Field label={L('مبلغ (USD)', 'Amount (USD)')}>
                <input
                  className="input"
                  type="number"
                  min="1"
                  step="0.01"
                  dir="ltr"
                  value={deposit.amount}
                  onChange={(event) => setDeposit({ ...deposit, amount: event.target.value })}
                  required
                />
              </Field>
              <Field label={L('روش پرداخت', 'Payment method')}>
                <select
                  className="input"
                  value={deposit.method}
                  onChange={(event) => setDeposit({ ...deposit, method: event.target.value })}
                >
                  {METHODS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={L('شناسه تراکنش (اختیاری)', 'Transaction reference (optional)')}>
                <input
                  className="input"
                  dir="ltr"
                  value={deposit.txRef}
                  onChange={(event) => setDeposit({ ...deposit, txRef: event.target.value })}
                  placeholder="TX-..."
                />
              </Field>
              <Button type="submit" variant="gold" className="w-full" disabled={busy}>
                {busy ? <Spinner className="h-3.5 w-3.5" /> : <ArrowDownLeft size={15} />}
                {L('ثبت درخواست واریز', 'Submit deposit request')}
              </Button>
              <p className="text-[10.5px] leading-relaxed text-mute/50">
                {L(
                  'موجودی فقط پس از تأیید تیم مالی و ثبت در دفتر تراکنش‌ها افزایش می‌یابد.',
                  'Your balance increases only after finance approval and ledger recording.',
                )}
              </p>
            </form>
          ) : (
            <form onSubmit={submitWithdrawal} className="space-y-3.5">
              <Field label={L('مبلغ (USD)', 'Amount (USD)')} hint={L(`قابل استفاده: ${wallet.available}`, `Available: ${wallet.available}`)}>
                <input
                  className="input"
                  type="number"
                  min="1"
                  step="0.01"
                  dir="ltr"
                  value={withdraw.amount}
                  onChange={(event) => setWithdraw({ ...withdraw, amount: event.target.value })}
                  required
                />
              </Field>
              <Field label={L('مقصد برداشت', 'Destination')}>
                <input
                  className="input"
                  dir="ltr"
                  value={withdraw.destination}
                  onChange={(event) => setWithdraw({ ...withdraw, destination: event.target.value })}
                  placeholder="USDT TRC20 — address"
                  required
                />
              </Field>
              <Button type="submit" variant="gold" className="w-full" disabled={busy}>
                {busy ? <Spinner className="h-3.5 w-3.5" /> : <ArrowUpRight size={15} />}
                {L('ثبت درخواست برداشت', 'Submit withdrawal request')}
              </Button>
              <p className="text-[10.5px] leading-relaxed text-mute/50">
                {L(
                  'مبلغ درخواست تا زمان بررسی از موجودی قابل استفاده رزرو می‌شود.',
                  'The amount is reserved from your available balance until review.',
                )}
              </p>
            </form>
          )}
        </Card>

        <Card className="p-0">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-[13px] font-semibold">{L('تاریخچه تراکنش‌ها', 'Transaction history')}</h2>
          </div>
          <Table
            rows={transactions}
            columns={[
              {
                key: 'kind',
                label: L('نوع', 'Type'),
                render: (row) => <span className="text-white/85">{L(...(KIND_LABELS[row.kind] || [row.kind, row.kind]))}</span>,
              },
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={
              <div className="py-8 text-center text-[12px] text-mute/70">
                {L('تراکنشی ثبت نشده است.', 'No transactions recorded.')}
              </div>
            }
          />
        </Card>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <Card className="p-0">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <Landmark size={14} className="text-gold" />
            <h2 className="text-[13px] font-semibold">{L('درخواست‌های واریز', 'Deposit requests')}</h2>
          </div>
          <Table
            rows={deposits}
            columns={[
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              { key: 'method', label: L('روش', 'Method') },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={<div className="py-6 text-center text-[12px] text-mute/60">{L('درخواستی نیست.', 'No requests.')}</div>}
          />
        </Card>

        <Card className="p-0">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <ArrowUpRight size={14} className="text-gold" />
            <h2 className="text-[13px] font-semibold">{L('درخواست‌های برداشت', 'Withdrawal requests')}</h2>
          </div>
          <Table
            rows={withdrawals}
            columns={[
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              {
                key: 'destination',
                label: L('مقصد', 'Destination'),
                render: (row) => <span className="block max-w-[160px] truncate text-[11px] text-mute" dir="ltr">{row.destination}</span>,
              },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={<div className="py-6 text-center text-[12px] text-mute/60">{L('درخواستی نیست.', 'No requests.')}</div>}
          />
        </Card>
      </div>
    </Shell>
  );
}
