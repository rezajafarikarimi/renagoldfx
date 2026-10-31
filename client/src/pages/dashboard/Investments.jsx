import { TrendingUp, Plus } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
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

export default function Investments() {
  const { L, lang } = useLang();
  const { data, loading } = useApi('/me/investments');
  const { data: walletData } = useApi('/me/wallet');

  const investments = data?.investments || [];
  const pending = investments.filter((item) => item.status === 'PENDING');
  const approved = investments.filter((item) => item.status === 'APPROVED');
  const totalApproved = approved.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('سرمایه‌گذاری', 'Investment')}
        title={L('درخواست‌های سرمایه‌گذاری', 'Investment requests')}
        description={L(
          'وضعیت درخواست‌های خود را پیگیری کنید. تأیید یا رد درخواست فقط توسط تیم مالی انجام می‌شود.',
          'Track your requests. Approval or rejection is handled only by the finance team.',
        )}
        actions={
          <Button to="/dashboard/plans" variant="gold" size="sm">
            <Plus size={14} />
            {L('درخواست جدید', 'New request')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat label={L('کل درخواست‌ها', 'Total requests')} value={<span className="tabular-nums">{investments.length}</span>} icon={TrendingUp} />
        <Stat label={L('در انتظار بررسی', 'Awaiting review')} value={<span className="tabular-nums">{pending.length}</span>} icon={TrendingUp} tone="mute" />
        <Stat label={L('تأیید شده', 'Approved')} value={<span className="tabular-nums">{approved.length}</span>} icon={TrendingUp} />
        <Stat
          label={L('سرمایه فعال', 'Active capital')}
          value={<Money value={totalApproved} className="text-xl" />}
          icon={TrendingUp}
          hint={L(`قابل استفاده: ${walletData?.wallet?.available ?? 0}`, `Available: ${walletData?.wallet?.available ?? 0}`)}
        />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <h2 className="text-[13px] font-semibold">{L('تاریخچه درخواست‌ها', 'Request history')}</h2>
        </div>
        {loading ? (
          <LoadingBlock />
        ) : (
          <Table
            rows={investments}
            columns={[
              {
                key: 'planCode',
                label: L('طرح', 'Plan'),
                render: (row) => (
                  <div>
                    <p className="text-[12.5px] text-white/90">{L(row.planNameFa || row.planCode || '—', row.planNameEn || row.planCode || '—')}</p>
                    <p className="text-[10px] uppercase tracking-wide text-mute/50">{row.planCode || '—'}</p>
                  </div>
                ),
              },
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'adminNote',
                label: L('یادداشت مدیر', 'Admin note'),
                render: (row) => <span className="text-[11px] text-mute/70">{row.adminNote || '—'}</span>,
              },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={
              <div className="py-8 text-center text-[12px] text-mute/70">
                {L('هنوز درخواستی ثبت نکرده‌اید.', 'You have not submitted a request yet.')}
              </div>
            }
          />
        )}
      </Card>
    </Shell>
  );
}
