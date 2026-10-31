import { ScrollText } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import { Badge, Card, LoadingBlock, PageHeader, Table } from '../../components/ui.jsx';
import { useApi, formatDate } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function AdminAudit() {
  const { L, lang } = useLang();
  const { data, loading } = useApi('/admin/audit');
  const logs = data?.logs || [];

  return (
    <Shell variant="admin">
      <PageHeader
        eyebrow={L('امنیت', 'Security')}
        title={L('گزارش رخدادها', 'Audit log')}
        description={L(
          'تمام اقدامات حساس پلتفرم، از ورود کاربران تا تأیید درخواست‌های مالی، در اینجا ثبت می‌شود.',
          'Every sensitive platform action, from sign-ins to financial approvals, is recorded here.',
        )}
        actions={
          <Badge tone="gold">
            <ScrollText size={11} />
            {logs.length} {L('رخداد', 'events')}
          </Badge>
        }
      />

      <Card className="overflow-hidden p-0">
        {loading ? (
          <LoadingBlock />
        ) : (
          <Table
            rows={logs}
            columns={[
              {
                key: 'createdAt',
                label: L('زمان', 'Time'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
              {
                key: 'action',
                label: L('اقدام', 'Action'),
                render: (row) => <span dir="ltr" className="font-mono text-[11px] text-gold/85">{row.action}</span>,
              },
              {
                key: 'username',
                label: L('کاربر', 'Actor'),
                render: (row) => <span dir="ltr" className="text-[11.5px] text-white/85">{row.username ? `@${row.username}` : 'system'}</span>,
              },
              {
                key: 'target',
                label: L('هدف', 'Target'),
                render: (row) => (
                  <span dir="ltr" className="text-[10.5px] text-mute/70">
                    {row.targetType || '—'}
                    {row.targetId ? ` · ${String(row.targetId).slice(0, 8)}` : ''}
                  </span>
                ),
              },
              {
                key: 'meta',
                label: L('جزئیات', 'Details'),
                render: (row) => (
                  <span dir="ltr" className="block max-w-[260px] truncate font-mono text-[10px] text-mute/55">
                    {row.meta ? JSON.stringify(row.meta) : '—'}
                  </span>
                ),
              },
            ]}
            empty={<div className="py-8 text-center text-[12px] text-mute/60">{L('رخدادی ثبت نشده است.', 'No events recorded.')}</div>}
          />
        )}
      </Card>
    </Shell>
  );
}
