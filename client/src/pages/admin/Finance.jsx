import { useState } from 'react';
import { Check, X, Download } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  ConfirmDialog,
  LoadingBlock,
  Money,
  PageHeader,
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

export default function AdminFinance() {
  const { L, lang } = useLang();
  const toast = useToast();
  const [tab, setTab] = useState('deposits');
  const [statusFilter, setStatusFilter] = useState('');
  const [txKind, setTxKind] = useState('');
  const [actionState, setActionState] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const isRequests = tab !== 'transactions';
  const requestsPath = `/admin/requests/${tab}?status=${statusFilter}`;
  const transactionsPath = `/admin/transactions?status=${statusFilter}&kind=${txKind}&q=`;

  const {
    data: requestData,
    loading: requestLoading,
    reload: reloadRequests,
  } = useApi(requestsPath, { enabled: isRequests });

  const {
    data: txData,
    loading: txLoading,
    reload: reloadTransactions,
  } = useApi(transactionsPath, { enabled: !isRequests });

  const rows = isRequests ? requestData?.requests || [] : txData?.transactions || [];
  const loading = isRequests ? requestLoading : txLoading;

  const openAction = (row, action) => {
    setActionState({ row, action });
    setNote('');
  };

  const confirm = async () => {
    if (!actionState) return;
    setBusy(true);
    try {
      await post(`/admin/requests/${tab}/${actionState.row.id}/review`, {
        action: actionState.action,
        note,
      });
      toast(
        actionState.action === 'APPROVE'
          ? L('درخواست تأیید شد و دفتر تراکنش‌ها به‌روزرسانی شد.', 'Request approved and ledger updated.')
          : L('درخواست رد شد.', 'Request rejected.'),
        actionState.action === 'APPROVE' ? 'success' : 'info',
      );
      setActionState(null);
      reloadRequests();
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
    } finally {
      setBusy(false);
    }
  };

  const requestColumns = [
    {
      key: 'username',
      label: L('کاربر', 'User'),
      render: (row) => (
        <div>
          <p className="text-[12.5px] text-white/90">{row.fullName}</p>
          <p className="text-[10.5px] text-mute/60" dir="ltr">@{row.username}</p>
        </div>
      ),
    },
    { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
    ...(tab === 'deposits'
      ? [
          { key: 'method', label: L('روش', 'Method'), render: (row) => <span className="text-[11.5px] text-mute">{row.method}</span> },
          { key: 'txRef', label: L('شناسه', 'Reference'), render: (row) => <span dir="ltr" className="text-[10.5px] text-mute/70">{row.txRef || '—'}</span> },
        ]
      : []),
    ...(tab === 'withdrawals'
      ? [
          {
            key: 'destination',
            label: L('مقصد', 'Destination'),
            render: (row) => <span dir="ltr" className="block max-w-[180px] truncate text-[10.5px] text-mute/70">{row.destination}</span>,
          },
        ]
      : []),
    ...(tab === 'investments'
      ? [
          { key: 'planCode', label: L('طرح', 'Plan'), render: (row) => <span className="text-[11.5px] text-mute">{row.planCode || '—'}</span> },
        ]
      : []),
    { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'createdAt',
      label: L('تاریخ', 'Date'),
      render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
    },
    {
      key: 'actions',
      label: L('اقدامات', 'Actions'),
      render: (row) =>
        row.status === 'PENDING' ? (
          <div className="flex items-center gap-1.5">
            <Button variant="gold" size="sm" onClick={() => openAction(row, 'APPROVE')}>
              <Check size={12} />
              {L('تأیید', 'Approve')}
            </Button>
            <Button variant="danger" size="sm" onClick={() => openAction(row, 'REJECT')}>
              <X size={12} />
              {L('رد', 'Reject')}
            </Button>
          </div>
        ) : (
          <span className="text-[10.5px] text-mute/50">{row.adminNote || '—'}</span>
        ),
    },
  ];

  return (
    <Shell variant="admin">
      <PageHeader
        eyebrow={L('مالی', 'Finance')}
        title={L('مالی و تراکنش‌ها', 'Finance & transactions')}
        description={L(
          'تأیید یا رد درخواست‌ها، بررسی دفتر تراکنش‌ها و خروجی گزارش. هر اقدام در گزارش رخدادها ثبت می‌شود.',
          'Approve or reject requests, review the ledger and export reports. Every action is audit-logged.',
        )}
        actions={
          <a href="/api/admin/reports/transactions" className="btn btn-ghost btn-sm">
            <Download size={13} />
            {L('خروجی CSV', 'Export CSV')}
          </a>
        }
      />

      <Tabs
        value={tab}
        onChange={(value) => {
          setTab(value);
          setStatusFilter('');
        }}
        tabs={[
          { value: 'deposits', label: L('واریزها', 'Deposits') },
          { value: 'withdrawals', label: L('برداشت‌ها', 'Withdrawals') },
          { value: 'investments', label: L('سرمایه‌گذاری‌ها', 'Investments') },
          { value: 'transactions', label: L('دفتر تراکنش‌ها', 'Transaction ledger') },
        ]}
      />

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <h2 className="text-[13px] font-semibold">
            {isRequests ? L('درخواست‌ها', 'Requests') : L('تراکنش‌ها', 'Transactions')}
          </h2>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            <select
              className="input w-auto py-1.5 text-[11.5px]"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">{L('همه وضعیت‌ها', 'All statuses')}</option>
              <option value="PENDING">{L('در انتظار', 'Pending')}</option>
              <option value="APPROVED">{L('تأیید شده', 'Approved')}</option>
              <option value="REJECTED">{L('رد شده', 'Rejected')}</option>
            </select>
            {!isRequests ? (
              <select
                className="input w-auto py-1.5 text-[11.5px]"
                value={txKind}
                onChange={(event) => setTxKind(event.target.value)}
              >
                <option value="">{L('همه انواع', 'All types')}</option>
                {Object.entries(KIND_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {L(label[0], label[1])}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        </div>

        {loading ? (
          <LoadingBlock />
        ) : isRequests ? (
          <Table
            rows={rows}
            columns={requestColumns}
            empty={<div className="py-8 text-center text-[12px] text-mute/60">{L('درخواستی با این فیلتر نیست.', 'No requests for this filter.')}</div>}
          />
        ) : (
          <Table
            rows={rows}
            columns={[
              { key: 'username', label: L('کاربر', 'User'), render: (row) => <span dir="ltr" className="text-[11.5px] text-white/85">@{row.username}</span> },
              {
                key: 'kind',
                label: L('نوع', 'Type'),
                render: (row) => <span className="text-[11.5px] text-mute">{L(...(KIND_LABELS[row.kind] || [row.kind, row.kind]))}</span>,
              },
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              { key: 'reference', label: L('مرجع', 'Reference'), render: (row) => <span dir="ltr" className="text-[10.5px] text-mute/70">{row.reference || '—'}</span> },
              { key: 'createdAt', label: L('تاریخ', 'Date'), render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span> },
            ]}
            empty={<div className="py-8 text-center text-[12px] text-mute/60">{L('تراکنشی با این فیلتر نیست.', 'No transactions for this filter.')}</div>}
          />
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(actionState)}
        onClose={() => setActionState(null)}
        onConfirm={confirm}
        busy={busy}
        danger={actionState?.action === 'REJECT'}
        note
        noteValue={note}
        onNoteChange={setNote}
        title={
          actionState?.action === 'APPROVE'
            ? L('تأیید درخواست', 'Approve request')
            : L('رد درخواست', 'Reject request')
        }
        confirmLabel={actionState?.action === 'APPROVE' ? L('تأیید و به‌روزرسانی', 'Approve & update') : L('رد درخواست', 'Reject')}
        description={
          actionState
            ? L(
                `درخواست کاربر @${actionState.row.username} به مبلغ ${actionState.row.amount} دلار بررسی می‌شود. تأیید، دفتر تراکنش و موجودی کیف پول را تغییر می‌دهد.`,
                `This will review @${actionState.row.username}'s request of $${actionState.row.amount}. Approval updates the ledger and wallet balance.`,
              )
            : ''
        }
      />
    </Shell>
  );
}
