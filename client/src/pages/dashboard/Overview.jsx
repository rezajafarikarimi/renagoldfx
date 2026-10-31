import { Link } from 'react-router-dom';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Clock3,
  LifeBuoy,
  ArrowUpRight,
  ArrowDownLeft,
  Bell,
  Gem,
  ShieldCheck,
} from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Badge,
  Button,
  Card,
  LoadingBlock,
  Money,
  PageHeader,
  Stat,
  StatusBadge,
  Table,
  useToast,
} from '../../components/ui.jsx';
import { formatDate } from '../../lib/api.js';
import { useApi, post } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const KIND_LABELS = {
  DEPOSIT: ['واریز', 'Deposit'],
  WITHDRAWAL: ['برداشت', 'Withdrawal'],
  INVESTMENT: ['سرمایه‌گذاری', 'Investment'],
  COMMISSION: ['کمیسیون', 'Commission'],
  ADJUSTMENT: ['تعدیل', 'Adjustment'],
};

export default function Overview() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/me/overview');

  if (loading) {
    return (
      <Shell variant="user">
        <LoadingBlock />
      </Shell>
    );
  }

  const wallet = data?.wallet || { balance: 0, available: 0 };
  const counts = data?.counts || {};
  const transactions = data?.recentTransactions || [];
  const notifications = data?.notifications || [];
  const unread = notifications.filter((item) => !item.read).length;

  const markAll = async () => {
    await post('/me/notifications/read-all');
    toast(L('اعلان‌ها خوانده شدند', 'Notifications marked as read'), 'info');
    reload();
  };

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('پنل کاربری', 'Member area')}
        title={L(`سلام ${data?.profile?.fullName || ''}`, `Hello ${data?.profile?.fullName || ''}`)}
        description={L(
          'خلاصه وضعیت حساب، کیف پول و آخرین فعالیت‌های شما.',
          'A summary of your account, wallet and latest activity.',
        )}
        actions={
          <>
            <Button to="/dashboard/wallet" variant="gold" size="sm">
              <ArrowDownLeft size={14} />
              {L('واریز', 'Deposit')}
            </Button>
            <Button to="/dashboard/wallet" variant="ghost" size="sm">
              <ArrowUpRight size={14} />
              {L('کیف پول', 'Wallet')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          label={L('موجودی کل', 'Total balance')}
          value={<Money value={wallet.balance} className="text-xl" />}
          icon={WalletIcon}
        />
        <Stat
          label={L('موجودی قابل استفاده', 'Available balance')}
          value={<Money value={wallet.available} className="text-xl" />}
          icon={TrendingUp}
          tone="gold"
          hint={L('قابل استفاده برای درخواست‌های جدید', 'Usable for new requests')}
        />
        <Stat
          label={L('درخواست‌های در انتظار', 'Pending requests')}
          value={
            <span className="tabular-nums">
              {(counts.pendingDeposits || 0) + (counts.pendingWithdrawals || 0) + (counts.pendingInvestments || 0)}
            </span>
          }
          hint={L(
            `واریز ${counts.pendingDeposits || 0} · برداشت ${counts.pendingWithdrawals || 0} · سرمایه‌گذاری ${counts.pendingInvestments || 0}`,
            `Deposits ${counts.pendingDeposits || 0} · Withdrawals ${counts.pendingWithdrawals || 0} · Investments ${counts.pendingInvestments || 0}`,
          )}
          icon={Clock3}
          tone="mute"
        />
        <Stat
          label={L('تیکت‌های باز', 'Open tickets')}
          value={<span className="tabular-nums">{counts.openTickets || 0}</span>}
          icon={LifeBuoy}
          tone="mute"
          hint={L('پشتیبانی ۲۴/۷', '24/7 support')}
        />
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-[13px] font-semibold">{L('آخرین تراکنش‌ها', 'Recent transactions')}</h2>
            <Link to="/dashboard/wallet" className="text-[11px] text-gold/80 hover:text-gold">
              {L('مشاهده همه', 'View all')}
            </Link>
          </div>
          <Table
            keyField="id"
            rows={transactions}
            columns={[
              {
                key: 'kind',
                label: L('نوع', 'Type'),
                render: (row) => <span className="text-white/85">{L(...(KIND_LABELS[row.kind] || [row.kind, row.kind]))}</span>,
              },
              {
                key: 'amount',
                label: L('مبلغ', 'Amount'),
                render: (row) => <Money value={row.amount} className="text-[13px]" />,
              },
              {
                key: 'status',
                label: L('وضعیت', 'Status'),
                render: (row) => <StatusBadge status={row.status} />,
              },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11.5px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={
              <div className="py-8 text-center text-[12px] text-mute/70">
                {L('هنوز تراکنشی ثبت نشده است.', 'No transactions yet.')}
              </div>
            }
          />
        </Card>

        <div className="space-y-3">
          <Card className="p-0">
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Bell size={14} className="text-gold" />
                {L('اعلان‌ها', 'Notifications')}
                {unread ? <Badge tone="gold">{unread}</Badge> : null}
              </h2>
              {unread ? (
                <button type="button" onClick={markAll} className="text-[10.5px] text-gold/70 hover:text-gold">
                  {L('خواندن همه', 'Mark all')}
                </button>
              ) : null}
            </div>
            <div className="max-h-[260px] space-y-2 overflow-y-auto p-3">
              {notifications.length === 0 ? (
                <p className="py-6 text-center text-[11.5px] text-mute/60">
                  {L('اعلانی وجود ندارد.', 'No notifications.')}
                </p>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-2.5 ${
                      item.read ? 'border-white/[0.06] bg-white/[0.015]' : 'border-gold/25 bg-gold/[0.05]'
                    }`}
                  >
                    <p className="text-[12px] font-medium text-white/90">{item.title}</p>
                    {item.body ? <p className="mt-1 text-[11px] leading-relaxed text-mute/70">{item.body}</p> : null}
                    <p className="mt-1 text-[9.5px] text-mute/45">{formatDate(item.createdAt, lang)}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-[13px] font-semibold">{L('دسترسی سریع', 'Quick access')}</h2>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Link to="/dashboard/plans" className="side-link">
                <Gem size={14} /> {L('طرح‌های درآمدی', 'Income plans')}
              </Link>
              <Link to="/dashboard/investments" className="side-link">
                <TrendingUp size={14} /> {L('سرمایه‌گذاری', 'Investments')}
              </Link>
              <Link to="/dashboard/security" className="side-link">
                <ShieldCheck size={14} /> {L('امنیت', 'Security')}
              </Link>
              <Link to="/dashboard/support" className="side-link">
                <LifeBuoy size={14} /> {L('پشتیبانی', 'Support')}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
