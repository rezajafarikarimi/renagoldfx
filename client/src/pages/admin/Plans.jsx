import { useState } from 'react';
import { Layers, Lock, Plus, Pencil } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Badge,
  Button,
  Card,
  Field,
  LoadingBlock,
  Money,
  PageHeader,
  Spinner,
  StatusBadge,
  Table,
  useToast,
} from '../../components/ui.jsx';
import { post, patch, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const EMPTY_PLAN = {
  code: '',
  nameFa: '',
  nameEn: '',
  descriptionFa: '',
  descriptionEn: '',
  minAmount: '',
  maxAmount: '',
  roiPercent: '',
  durationDays: '',
  isPublic: true,
  allocationNotes: '',
};

export default function AdminPlans() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/admin/plans');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PLAN);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const plans = data?.plans || [];

  const openEdit = (plan) => {
    setError('');
    if (!plan) {
      setEditing('new');
      setForm(EMPTY_PLAN);
      return;
    }
    setEditing(plan.id);
    setForm({
      code: plan.code,
      nameFa: plan.nameFa || '',
      nameEn: plan.nameEn || '',
      descriptionFa: plan.descriptionFa || '',
      descriptionEn: plan.descriptionEn || '',
      minAmount: plan.minAmount ?? '',
      maxAmount: plan.maxAmount ?? '',
      roiPercent: plan.roiPercent ?? '',
      durationDays: plan.durationDays ?? '',
      isPublic: plan.isPublic,
      allocationNotes: plan.allocationNotes || '',
    });
  };

  const isPool = form.code?.toUpperCase() === 'POOL1';

  const save = async () => {
    setError('');
    setBusy(true);
    try {
      const payload = {
        ...form,
        isPublic: isPool ? false : form.isPublic,
        maxAmount: form.maxAmount === '' ? null : form.maxAmount,
        roiPercent: form.roiPercent === '' ? null : form.roiPercent,
        durationDays: form.durationDays === '' ? null : form.durationDays,
      };
      if (editing === 'new') {
        await post('/admin/plans', payload);
        toast(L('طرح جدید ایجاد شد.', 'Plan created.'));
      } else {
        await patch(`/admin/plans/${editing}`, payload);
        toast(L('طرح به‌روزرسانی شد.', 'Plan updated.'));
      }
      setEditing(null);
      reload();
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell variant="admin">
      <PageHeader
        eyebrow={L('مدیریت', 'Administration')}
        title={L('طرح‌ها و Pool1', 'Plans & Pool1')}
        description={L(
          'طرح‌های عمومی و مخزن داخلی. اطلاعات تخصیص Pool1 فقط در این پنل قابل مشاهده است و هرگز برای کاربران عادی نمایش داده نمی‌شود.',
          'Public plans and the internal pool. Pool1 allocation data is visible only here and is never exposed to ordinary users.',
        )}
        actions={
          <Button variant="gold" size="sm" onClick={() => openEdit(null)}>
            <Plus size={14} />
            {L('طرح جدید', 'New plan')}
          </Button>
        }
      />

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/[0.05] px-3.5 py-2.5 text-[11.5px] text-gold/85">
        <Lock size={13} className="shrink-0" />
        {L(
          'Pool1 در بک‌اند به‌عنوان طرح غیرعمومی اجباری شده است؛ حتی اگر در این پنل انتخاب شود، در API عمومی ظاهر نمی‌شود.',
          'Pool1 is enforced as non-public in the backend; even if toggled here, it never appears in the public API.',
        )}
      </div>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <LoadingBlock />
        ) : (
          <Table
            rows={plans}
            columns={[
              {
                key: 'code',
                label: L('طرح', 'Plan'),
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-gold/25 bg-gold/10 p-1.5 text-gold">
                      <Layers size={13} />
                    </span>
                    <div>
                      <p className="text-[12.5px] text-white/90">{L(row.nameFa, row.nameEn)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-mute/50">{row.code}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'range',
                label: L('بازه سرمایه', 'Capital range'),
                render: (row) => (
                  <span className="text-[11.5px] text-mute">
                    <Money value={row.minAmount} className="text-[11.5px]" /> —{' '}
                    {row.maxAmount === null ? L('بدون سقف', 'No cap') : <Money value={row.maxAmount} className="text-[11.5px]" />}
                  </span>
                ),
              },
              {
                key: 'roiPercent',
                label: L('هدف بازدهی', 'Return target'),
                render: (row) => <span className="text-[11.5px] text-gold">{row.roiPercent ? `${row.roiPercent}%` : '—'}</span>,
              },
              {
                key: 'durationDays',
                label: L('مدت', 'Duration'),
                render: (row) => <span className="text-[11.5px] text-mute">{row.durationDays ? `${row.durationDays}d` : '—'}</span>,
              },
              {
                key: 'isPublic',
                label: L('نمایش', 'Visibility'),
                render: (row) =>
                  row.isPublic ? <Badge tone="up">{L('عمومی', 'Public')}</Badge> : <Badge tone="gold">{L('داخلی', 'Internal')}</Badge>,
              },
              {
                key: 'active',
                label: L('وضعیت', 'Status'),
                render: (row) => <StatusBadge status={row.active ? 'ACTIVE' : 'SUSPENDED'} />,
              },
              {
                key: 'allocationNotes',
                label: L('یادداشت تخصیص', 'Allocation note'),
                render: (row) => (
                  <span className="block max-w-[200px] truncate text-[10.5px] text-mute/60">{row.allocationNotes || '—'}</span>
                ),
              },
              {
                key: 'actions',
                label: L('اقدام', 'Action'),
                render: (row) => (
                  <Button variant="soft" size="sm" onClick={() => openEdit(row)}>
                    <Pencil size={12} />
                    {L('ویرایش', 'Edit')}
                  </Button>
                ),
              },
            ]}
            empty={<div className="py-8 text-center text-[12px] text-mute/60">{L('طرحی وجود ندارد.', 'No plans yet.')}</div>}
          />
        )}
      </Card>

      {editing ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
          <button type="button" aria-label="close" className="absolute inset-0" onClick={() => setEditing(null)} />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/20 bg-panel p-5 shadow-panel">
            <h2 className="text-base font-semibold">
              {editing === 'new' ? L('طرح جدید', 'New plan') : L('ویرایش طرح', 'Edit plan')}
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label={L('کد طرح', 'Plan code')}>
                <input
                  className="input"
                  dir="ltr"
                  value={form.code}
                  onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })}
                  disabled={editing !== 'new'}
                />
              </Field>
              <Field label={L('وضعیت فعال', 'Active')}>
                <select
                  className="input"
                  value={form.active === false ? '0' : '1'}
                  onChange={(event) => setForm({ ...form, active: event.target.value === '1' })}
                >
                  <option value="1">{L('فعال', 'Active')}</option>
                  <option value="0">{L('غیرفعال', 'Inactive')}</option>
                </select>
              </Field>
              <Field label={L('نام (فارسی)', 'Name (Persian)')}>
                <input className="input" value={form.nameFa} onChange={(event) => setForm({ ...form, nameFa: event.target.value })} />
              </Field>
              <Field label={L('نام (انگلیسی)', 'Name (English)')}>
                <input className="input" dir="ltr" value={form.nameEn} onChange={(event) => setForm({ ...form, nameEn: event.target.value })} />
              </Field>
              <Field label={L('حداقل سرمایه', 'Minimum amount')}>
                <input className="input" type="number" dir="ltr" value={form.minAmount} onChange={(event) => setForm({ ...form, minAmount: event.target.value })} />
              </Field>
              <Field label={L('حداکثر سرمایه', 'Maximum amount')} hint={L('خالی = بدون سقف', 'Empty = no cap')}>
                <input className="input" type="number" dir="ltr" value={form.maxAmount} onChange={(event) => setForm({ ...form, maxAmount: event.target.value })} />
              </Field>
              <Field label={L('هدف بازدهی ماهانه (%)', 'Monthly return target (%)')}>
                <input className="input" type="number" dir="ltr" value={form.roiPercent} onChange={(event) => setForm({ ...form, roiPercent: event.target.value })} />
              </Field>
              <Field label={L('مدت (روز)', 'Duration (days)')}>
                <input className="input" type="number" dir="ltr" value={form.durationDays} onChange={(event) => setForm({ ...form, durationDays: event.target.value })} />
              </Field>
              <Field label={L('توضیح (فارسی)', 'Description (Persian)')} className="sm:col-span-2">
                <textarea className="input min-h-[70px]" value={form.descriptionFa} onChange={(event) => setForm({ ...form, descriptionFa: event.target.value })} />
              </Field>
              <Field label={L('توضیح (انگلیسی)', 'Description (English)')} className="sm:col-span-2">
                <textarea className="input min-h-[70px]" dir="ltr" value={form.descriptionEn} onChange={(event) => setForm({ ...form, descriptionEn: event.target.value })} />
              </Field>
              <Field
                label={L('نمایش عمومی', 'Public visibility')}
                hint={isPool ? L('Pool1 همیشه داخلی است و قابل انتشار نیست.', 'Pool1 is always internal and cannot be published.') : ''}
              >
                <select
                  className="input"
                  value={form.isPublic ? '1' : '0'}
                  disabled={isPool}
                  onChange={(event) => setForm({ ...form, isPublic: event.target.value === '1' })}
                >
                  <option value="1">{L('عمومی', 'Public')}</option>
                  <option value="0">{L('داخلی (فقط مدیر)', 'Internal (admin only)')}</option>
                </select>
              </Field>
              <Field label={L('یادداشت تخصیص داخلی', 'Internal allocation note')} hint={L('فقط در پنل مدیریت نمایش داده می‌شود.', 'Visible in the admin panel only.')}>
                <input className="input" value={form.allocationNotes} onChange={(event) => setForm({ ...form, allocationNotes: event.target.value })} />
              </Field>
            </div>

            {error ? (
              <p className="mt-3 rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
            ) : null}

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="soft" size="sm" onClick={() => setEditing(null)}>
                {L('انصراف', 'Cancel')}
              </Button>
              <Button variant="gold" size="sm" onClick={save} disabled={busy}>
                {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
                {L('ذخیره طرح', 'Save plan')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}
