import { useState } from 'react';
import { Search, ShieldCheck, UserCog, Eye, SlidersHorizontal } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Badge,
  Button,
  Card,
  Field,
  LoadingBlock,
  Modal,
  Money,
  PageHeader,
  Spinner,
  StatusBadge,
  Table,
  useToast,
} from '../../components/ui.jsx';
import { get, patch, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function AdminUsers() {
  const { L, lang } = useLang();
  const toast = useToast();
  const [filters, setFilters] = useState({ q: '', status: '', role: '' });
  const [draft, setDraft] = useState({ q: '' });

  const query = new URLSearchParams();
  if (filters.q) query.set('q', filters.q);
  if (filters.status) query.set('status', filters.status);
  if (filters.role) query.set('role', filters.role);
  const { data, loading, reload } = useApi(`/admin/users?${query.toString()}`);

  const users = data?.users || [];

  const [manage, setManage] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form, setForm] = useState({ status: 'ACTIVE', role: 'USER', kycStatus: 'UNVERIFIED' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const openManage = (user) => {
    setManage(user);
    setForm({ status: user.status, role: user.role, kycStatus: user.kycStatus });
    setError('');
  };

  const openDetail = async (user) => {
    setDetail({ user, loading: true });
    setDetailLoading(true);
    try {
      const result = await get(`/admin/users/${user.id}`);
      setDetail(result);
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const save = async () => {
    setBusy(true);
    setError('');
    try {
      await patch(`/admin/users/${manage.id}`, form);
      toast(L('اطلاعات کاربر به‌روزرسانی شد.', 'User updated.'));
      setManage(null);
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
        title={L('مدیریت کاربران', 'User management')}
        description={L(
          'جستجو، بررسی و تغییر وضعیت حساب‌ها. تغییر نقش فقط توسط مدیر مجاز انجام می‌شود.',
          'Search, inspect and change account status. Role changes are restricted to authorized admins.',
        )}
      />

      <Card className="mb-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setFilters({ ...filters, q: draft.q.trim() });
          }}
          className="grid gap-2.5 sm:grid-cols-[1.4fr_0.8fr_0.8fr_auto]"
        >
          <div className="relative">
            <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-mute/50" />
            <input
              className="input ps-9"
              placeholder={L('جستجوی نام، ایمیل یا نام کاربری', 'Search name, email or username')}
              value={draft.q}
              onChange={(event) => setDraft({ q: event.target.value })}
            />
          </div>
          <select
            className="input"
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          >
            <option value="">{L('همه وضعیت‌ها', 'All statuses')}</option>
            <option value="ACTIVE">{L('فعال', 'Active')}</option>
            <option value="SUSPENDED">{L('مسدود', 'Suspended')}</option>
          </select>
          <select
            className="input"
            value={filters.role}
            onChange={(event) => setFilters({ ...filters, role: event.target.value })}
          >
            <option value="">{L('همه نقش‌ها', 'All roles')}</option>
            <option value="USER">{L('کاربر', 'User')}</option>
            <option value="ADMIN">{L('مدیر', 'Admin')}</option>
          </select>
          <Button type="submit" variant="ghost">
            <SlidersHorizontal size={14} />
            {L('اعمال فیلتر', 'Apply')}
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <LoadingBlock />
        ) : (
          <Table
            rows={users}
            columns={[
              {
                key: 'fullName',
                label: L('کاربر', 'User'),
                render: (row) => (
                  <div>
                    <p className="text-[12.5px] text-white/90">{row.fullName}</p>
                    <p className="text-[10.5px] text-mute/60" dir="ltr">@{row.username} · {row.email}</p>
                  </div>
                ),
              },
              {
                key: 'balance',
                label: L('موجودی', 'Balance'),
                render: (row) => (
                  <div>
                    <Money value={row.balance} />
                    <p className="text-[10px] text-mute/50">{L('قابل استفاده', 'Available')}: {row.available}</p>
                  </div>
                ),
              },
              {
                key: 'role',
                label: L('نقش', 'Role'),
                render: (row) => (
                  <Badge tone={row.role === 'ADMIN' ? 'gold' : 'mute'}>{row.role === 'ADMIN' ? L('مدیر', 'Admin') : L('کاربر', 'User')}</Badge>
                ),
              },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              { key: 'kycStatus', label: L('احراز هویت', 'Verification'), render: (row) => <StatusBadge status={row.kycStatus} /> },
              {
                key: 'createdAt',
                label: L('عضویت', 'Joined'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang, false)}</span>,
              },
              {
                key: 'actions',
                label: L('اقدامات', 'Actions'),
                render: (row) => (
                  <div className="flex items-center gap-1.5">
                    <Button variant="soft" size="sm" onClick={() => openDetail(row)}>
                      <Eye size={12} />
                      {L('مشاهده', 'View')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openManage(row)}>
                      <UserCog size={12} />
                      {L('مدیریت', 'Manage')}
                    </Button>
                  </div>
                ),
              },
            ]}
            empty={<div className="py-8 text-center text-[12px] text-mute/60">{L('کاربری یافت نشد.', 'No users found.')}</div>}
          />
        )}
      </Card>

      <Modal open={Boolean(manage)} onClose={() => setManage(null)} title={L('مدیریت کاربر', 'Manage user')}>
        {manage ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <p className="text-[13px] font-semibold">{manage.fullName}</p>
              <p className="mt-0.5 text-[11px] text-mute/60" dir="ltr">@{manage.username} · {manage.email}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label={L('وضعیت', 'Status')}>
                <select className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  <option value="ACTIVE">{L('فعال', 'Active')}</option>
                  <option value="SUSPENDED">{L('مسدود', 'Suspended')}</option>
                </select>
              </Field>
              <Field label={L('نقش', 'Role')}>
                <select className="input" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option value="USER">{L('کاربر', 'User')}</option>
                  <option value="ADMIN">{L('مدیر', 'Admin')}</option>
                </select>
              </Field>
              <Field label={L('احراز هویت', 'Verification')}>
                <select className="input" value={form.kycStatus} onChange={(event) => setForm({ ...form, kycStatus: event.target.value })}>
                  <option value="UNVERIFIED">{L('تأیید نشده', 'Unverified')}</option>
                  <option value="PENDING">{L('در حال بررسی', 'In review')}</option>
                  <option value="VERIFIED">{L('تأیید شده', 'Verified')}</option>
                </select>
              </Field>
            </div>
            {error ? (
              <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
            ) : null}
            <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/[0.04] px-3 py-2.5 text-[11px] text-gold/80">
              <ShieldCheck size={13} />
              {L('تغییرات در گزارش رخدادها ثبت می‌شود.', 'Changes are recorded in the audit log.')}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="soft" size="sm" onClick={() => setManage(null)}>
                {L('انصراف', 'Cancel')}
              </Button>
              <Button variant="gold" size="sm" onClick={save} disabled={busy}>
                {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
                {L('ذخیره تغییرات', 'Save changes')}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={L('جزئیات کاربر', 'User details')} width="max-w-2xl">
        {detail?.loading || detailLoading ? (
          <LoadingBlock />
        ) : detail?.user ? (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.07] p-2.5">
                <p className="text-[10px] text-mute">{L('موجودی', 'Balance')}</p>
                <Money value={detail.user.balance} className="text-[13px]" />
              </div>
              <div className="rounded-xl border border-white/[0.07] p-2.5">
                <p className="text-[10px] text-mute">{L('قابل استفاده', 'Available')}</p>
                <Money value={detail.user.available} className="text-[13px]" />
              </div>
              <div className="rounded-xl border border-white/[0.07] p-2.5">
                <p className="text-[10px] text-mute">{L('عضویت', 'Joined')}</p>
                <p className="text-[12px]">{formatDate(detail.user.createdAt, lang, false)}</p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-medium text-white/80">{L('تراکنش‌های اخیر', 'Recent transactions')}</p>
              <div className="max-h-[220px] overflow-y-auto rounded-xl border border-white/[0.07]">
                <Table
                  rows={detail.transactions || []}
                  columns={[
                    { key: 'kind', label: L('نوع', 'Type'), render: (row) => <span className="text-[11px]">{row.kind}</span> },
                    { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} className="text-[11px]" /> },
                    { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
                    { key: 'createdAt', label: L('تاریخ', 'Date'), render: (row) => <span className="text-[10px] text-mute">{formatDate(row.createdAt, lang)}</span> },
                  ]}
                  empty={<p className="py-4 text-center text-[11px] text-mute/60">{L('تراکنشی نیست.', 'No transactions.')}</p>}
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] p-3">
                <p className="text-[11px] font-medium text-white/80">{L('سرمایه‌گذاری‌ها', 'Investments')}</p>
                {(detail.investments || []).length === 0 ? (
                  <p className="mt-1 text-[11px] text-mute/60">{L('موردی نیست.', 'None.')}</p>
                ) : (
                  detail.investments.map((item) => (
                    <div key={item.id} className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-mute">{item.planCode || '—'}</span>
                      <Money value={item.amount} className="text-[11px]" />
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
              </div>
              <div className="rounded-xl border border-white/[0.07] p-3">
                <p className="text-[11px] font-medium text-white/80">{L('تیکت‌ها', 'Tickets')}</p>
                {(detail.tickets || []).length === 0 ? (
                  <p className="mt-1 text-[11px] text-mute/60">{L('موردی نیست.', 'None.')}</p>
                ) : (
                  detail.tickets.map((ticket) => (
                    <div key={ticket.id} className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="truncate text-mute">{ticket.subject}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </Shell>
  );
}
