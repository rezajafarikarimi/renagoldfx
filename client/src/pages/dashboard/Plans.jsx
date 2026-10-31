import { useState } from 'react';
import { Gem, Percent, Timer, TrendingUp } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  Field,
  LoadingBlock,
  Modal,
  Money,
  PageHeader,
  Spinner,
  useToast,
} from '../../components/ui.jsx';
import { post, useApi, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function Plans() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/me/plans');
  const { data: walletData, reload: reloadWallet } = useApi('/me/wallet');

  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const plans = data?.plans || [];
  const available = walletData?.wallet?.available ?? 0;

  const open = (plan) => {
    setSelected(plan);
    setAmount(String(plan.minAmount ?? ''));
    setNotes('');
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await post('/me/investments', { planId: selected.id, amount: Number(amount), notes });
      toast(L('درخواست سرمایه‌گذاری ثبت شد و در انتظار بررسی است.', 'Investment request submitted and awaiting review.'), 'info');
      setSelected(null);
      reload();
      reloadWallet();
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('سرمایه‌گذاری', 'Investment')}
        title={L('طرح‌های درآمدی', 'Income plans')}
        description={L(
          'طرح‌های عمومی را مقایسه کنید. هر درخواست پیش از فعال‌سازی توسط تیم مالی بررسی می‌شود.',
          'Compare public plans. Every request is reviewed by the finance team before activation.',
        )}
        actions={
          <span className="chip-gold">
            {L('موجودی قابل استفاده:', 'Available:')} <Money value={available} />
          </span>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : plans.length === 0 ? (
        <Card>
          <p className="py-6 text-center text-[12.5px] text-mute">
            {L('در حال حاضر طرح عمومی فعالی وجود ندارد.', 'There are no active public plans right now.')}
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="panel-lift flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-xl border border-gold/25 bg-gold/10 p-2.5 text-gold">
                    <Gem size={18} strokeWidth={1.7} />
                  </span>
                  <span className="chip-gold">{plan.code}</span>
                </div>
                <h2 className="mt-3 text-[14px] font-semibold">{L(plan.nameFa, plan.nameEn)}</h2>
                <p className="mt-1.5 min-h-[48px] text-[11.5px] leading-relaxed text-mute/75">
                  {L(plan.descriptionFa, plan.descriptionEn)}
                </p>

                <div className="mt-3 space-y-1.5 text-[11.5px]">
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                    <span className="text-mute">{L('حداقل سرمایه', 'Minimum')}</span>
                    <Money value={plan.minAmount} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                    <span className="text-mute">{L('حداکثر سرمایه', 'Maximum')}</span>
                    {plan.maxAmount === null ? (
                      <span className="text-mute/60">{L('بدون سقف', 'No cap')}</span>
                    ) : (
                      <Money value={plan.maxAmount} />
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                    <span className="flex items-center gap-1 text-mute">
                      <Percent size={11} /> {L('هدف بازدهی ماهانه', 'Monthly return target')}
                    </span>
                    <span className="font-semibold text-gold">
                      {plan.roiPercent === null ? '—' : `${plan.roiPercent}%`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-2.5 py-1.5">
                    <span className="flex items-center gap-1 text-mute">
                      <Timer size={11} /> {L('مدت', 'Duration')}
                    </span>
                    <span className="text-white/85">
                      {plan.durationDays ? L(`${plan.durationDays} روز`, `${plan.durationDays} days`) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="gold" className="mt-4 w-full" onClick={() => open(plan)}>
                <TrendingUp size={14} />
                {L('درخواست سرمایه‌گذاری', 'Request investment')}
              </Button>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-mute/50">
        {L(
          'اعداد بازدهی، هدف هستند و تضمین سود محسوب نمی‌شوند. پیش از سرمایه‌گذاری، افشای ریسک را مطالعه کنید.',
          'Return figures are targets, not guaranteed profit. Read the risk disclosure before investing.',
        )}
      </p>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? L(`درخواست طرح ${selected.nameFa}`, `Request ${selected.nameEn || selected.nameFa}`) : ''}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setSelected(null)}>
              {L('انصراف', 'Cancel')}
            </Button>
            <Button variant="gold" size="sm" onClick={submit} disabled={busy}>
              {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
              {L('ثبت درخواست', 'Submit request')}
            </Button>
          </>
        }
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="rounded-xl border border-gold/20 bg-gold/[0.05] p-3 text-[11.5px] leading-relaxed text-mute">
            {L(
              `مبلغ از موجودی قابل استفاده شما رزرو می‌شود و پس از تأیید مدیر، فعال خواهد شد. موجودی فعلی: ${available} دلار`,
              `The amount is reserved from your available balance and activates after admin approval. Current available: $${available}`,
            )}
          </div>
          <Field
            label={L('مبلغ (USD)', 'Amount (USD)')}
            hint={
              selected
                ? L(
                    `حداقل ${selected.minAmount}${selected.maxAmount ? ` و حداکثر ${selected.maxAmount}` : ''}`,
                    `Minimum ${selected.minAmount}${selected.maxAmount ? `, maximum ${selected.maxAmount}` : ''}`,
                  )
                : ''
            }
          >
            <input
              className="input"
              type="number"
              min={selected?.minAmount ?? 0}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              dir="ltr"
              required
            />
          </Field>
          <Field label={L('یادداشت (اختیاری)', 'Note (optional)')}>
            <textarea
              className="input min-h-[76px]"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={L('توضیح تکمیلی برای تیم مالی', 'Any detail for the finance team')}
            />
          </Field>
          {error ? (
            <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
          ) : null}
        </form>
      </Modal>
    </Shell>
  );
}
