import { Link } from 'react-router-dom';
import { Users as UsersIcon, UserPlus } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import { Button, Card, LoadingBlock, PageHeader, Stat, StatusBadge, Table } from '../../components/ui.jsx';
import { useApi, formatDate } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function MyUsers() {
  const { L, lang } = useLang();
  const { data, loading } = useApi('/me/referrals');
  const users = data?.users || [];

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('شبکه شما', 'Your network')}
        title={L('کاربران شما', 'Your users')}
        description={L(
          'کاربرانی که با کد معرف شما ثبت‌نام کرده‌اند.',
          'Users who registered with your referral code.',
        )}
        actions={
          <Button to="/dashboard/referrals" variant="ghost" size="sm">
            {L('جزئیات کمیسیون', 'Commission details')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label={L('تعداد کاربران', 'Total users')} value={<span className="tabular-nums">{users.length}</span>} icon={UsersIcon} />
        <Stat label={L('کد معرف', 'Referral code')} value={<span className="font-mono text-base">{data?.code || '—'}</span>} icon={UserPlus} tone="mute" />
        <Stat
          label={L('فعال', 'Active')}
          value={<span className="tabular-nums">{users.filter((user) => user.status === 'ACTIVE').length}</span>}
          icon={UsersIcon}
          tone="mute"
        />
      </div>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="border-b border-white/[0.06] px-4 py-3">
          <h2 className="text-[13px] font-semibold">{L('فهرست کاربران', 'User list')}</h2>
        </div>
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
                    <p className="text-[10.5px] text-mute/60">@{row.username}</p>
                  </div>
                ),
              },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              { key: 'kycStatus', label: L('احراز هویت', 'Verification'), render: (row) => <StatusBadge status={row.kycStatus} /> },
              {
                key: 'createdAt',
                label: L('تاریخ عضویت', 'Joined'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang, false)}</span>,
              },
            ]}
            empty={
              <div className="py-10 text-center text-[12px] text-mute/70">
                {L('هنوز کاربری معرفی نکرده‌اید.', 'You have not referred anyone yet.')}{' '}
                <Link to="/dashboard/referrals" className="text-gold/80 hover:text-gold">
                  {L('دریافت لینک معرفی', 'Get your referral link')}
                </Link>
              </div>
            }
          />
        )}
      </Card>
    </Shell>
  );
}
