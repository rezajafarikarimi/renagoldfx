import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  ArrowDownLeft,
  ArrowUpRight,
  LifeBuoy,
  Activity,
  Wallet,
  Gift,
} from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Card,
  LoadingBlock,
  Money,
  PageHeader,
  Stat,
  StatusBadge,
  Table,
} from '../../components/ui.jsx';
import { useApi, formatDate } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const KIND_LABELS = {
  DEPOSIT: ['واریز', 'Deposit'],
  WITHDRAWAL: ['برداشت', 'Withdrawal'],
  INVESTMENT: ['سرمایه‌گذاری', 'Investment'],
  COMMISSION: ['کمیسیون', 'Commission'],
  ADJUSTMENT: ['تعدیل', 'Adjustment'],
};

export default function AdminOverview() {
  const { L, lang } = useLang();
  const { data, loading } = useApi('/admin/overview');

  if (loading) {
    return (
      <Shell variant="admin">
        <LoadingBlock />
      </Shell>
    );
  }

  const stats = data?.stats || {};

  return (
    <Shell variant="admin">
      <PageHeader
        eyebrow={L('مدیریت پلتفرم', 'Platform management')}
        title={L('نمای کلی مدیریت', 'Admin overview')}
        description={L(
          'وضعیت کاربران، درخواست‌های مالی و تیکت‌های باز در یک نگاه.',
          'Users, financial requests and open tickets at a glance.',
        )}
        actions={
          <Link to="/admin/finance" className="btn btn-gold btn-sm">
            {L('بررسی درخواست‌ها', 'Review requests')}
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label={L('کل کاربران', 'Total users')} value={<span className="tabular-nums">{stats.users ?? 0}</span>} icon={Users} />
        <Stat label={L('کاربران فعال', 'Active users')} value={<span className="tabular-nums">{stats.activeUsers ?? 0}</span>} icon={UserCheck} tone="up" />
        <Stat label={L('واریز در انتظار', 'Pending deposits')} value={<span className="tabular-nums">{stats.pendingDeposits ?? 0}</span>} icon={ArrowDownLeft} tone="mute" />
        <Stat label={L('برداشت در انتظار', 'Pending withdrawals')} value={<span className="tabular-nums">{stats.pendingWithdrawals ?? 0}</span>} icon={ArrowUpRight} tone="mute" />
        <Stat label={L('سرمایه‌گذاری در انتظار', 'Pending investments')} value={<span className="tabular-nums">{stats.pendingInvestments ?? 0}</span>} icon={Activity} tone="mute" />
        <Stat label={L('تیکت‌های باز', 'Open tickets')} value={<span className="tabular-nums">{stats.openTickets ?? 0}</span>} icon={LifeBuoy} tone="mute" />
        <Stat label={L('مجموع گردش تأییدشده', 'Approved volume')} value={<Money value={stats.volume} className="text-lg" />} icon={Activity} />
        <Stat label={L('مجموع موجودی کیف پول‌ها', 'Total wallet balance')} value={<Money value={stats.totalBalance} className="text-lg" />} icon={Wallet} />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-[13px] font-semibold">{L('آخرین تراکنش‌ها', 'Latest transactions')}</h2>
            <Link to="/admin/finance" className="text-[11px] text-gold/80 hover:text-gold">
              {L('همه تراکنش‌ها', 'All transactions')}
            </Link>
          </div>
          <Table
            rows={data?.recentTransactions || []}
            columns={[
              { key: 'username', label: L('کاربر', 'User'), render: (row) => <span dir="ltr" className="text-[11.5px] text-white/85">@{row.username}</span> },
              {
                key: 'kind',
                label: L('نوع', 'Type'),
                render: (row) => <span className="text-[11.5px] text-mute">{L(...(KIND_LABELS[row.kind] || [row.kind, row.kind]))}</span>,
              },
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={<div className="py-8 text-center text-[12px] text-mute/60">{L('تراکنشی نیست.', 'No transactions.')}</div>}
          />
        </Card>

        <div className="space-y-3">
          <Card className="p-0">
            <div className="border-b border-white/[0.06] px-4 py-3">
              <h2 className="text-[13px] font-semibold">{L('واریزهای در انتظار', 'Pending deposits')}</h2>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {(data?.pendingDeposits || []).length === 0 ? (
                <p className="px-4 py-5 text-[11.5px] text-mute/60">{L('موردی نیست.', 'Nothing pending.')}</p>
              ) : (
                data.pendingDeposits.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-[11.5px] text-white/85">@{item.username}</p>
                      <p className="text-[10px] text-mute/50">{item.method}</p>
                    </div>
                    <Money value={item.amount} />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-0">
            <div className="border-b border-white/[0.06] px-4 py-3">
              <h2 className="text-[13px] font-semibold">{L('تیکت‌های باز', 'Open tickets')}</h2>
            </div>
            <div className="divide-y divide-white/[0.06]">
              {(data?.openTickets || []).length === 0 ? (
                <p className="px-4 py-5 text-[11.5px] text-mute/60">{L('تیکتی نیست.', 'No open tickets.')}</p>
              ) : (
                data.openTickets.map((ticket) => (
                  <Link key={ticket.id} to="/admin/support" className="block px-4 py-2.5 transition hover:bg-white/[0.03]">
                    <p className="truncate text-[11.5px] text-white/85">{ticket.subject}</p>
                    <p className="mt-0.5 text-[10px] text-mute/50">
                      @{ticket.username} · {formatDate(ticket.updatedAt, lang)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-mute">{L('کمیسیون‌های پرداخت‌شده', 'Commissions paid')}</p>
              <span className="rounded-lg border border-gold/25 bg-gold/10 p-1.5 text-gold">
                <Gift size={14} />
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold text-gold">
              <Money value={data?.commissionsPaid || 0} />
            </p>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
