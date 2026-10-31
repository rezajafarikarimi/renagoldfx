import { Gift, Users, Coins, Copy } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Card,
  LoadingBlock,
  Money,
  PageHeader,
  Stat,
  StatusBadge,
  Table,
  useToast,
} from '../../components/ui.jsx';
import { useApi, formatDate } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function Referrals() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading } = useApi('/me/referrals');

  const code = data?.code || '';
  const link = code ? `${window.location.origin}/register?ref=${code}` : '';
  const users = data?.users || [];
  const commissions = data?.commissions || [];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast(L('لینک معرفی کپی شد.', 'Referral link copied.'), 'info');
    } catch {
      toast(L('کپی ممکن نشد.', 'Could not copy.'), 'error');
    }
  };

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('شبکه معرفی', 'Referral network')}
        title={L('کارمزد معرفی', 'Referral commission')}
        description={L(
          'لینک اختصاصی خود را به اشتراک بگذارید و درآمد معرفی را پیگیری کنید.',
          'Share your personal link and track referral earnings.',
        )}
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Stat label={L('کاربران معرفی‌شده', 'Referred users')} value={<span className="tabular-nums">{users.length}</span>} icon={Users} />
        <Stat label={L('کمیسیون تأییدشده', 'Approved commission')} value={<Money value={data?.totals?.commission || 0} className="text-xl" />} icon={Coins} />
        <Stat label={L('کد معرف', 'Referral code')} value={<span className="font-mono text-base tracking-wider">{code || '—'}</span>} icon={Gift} tone="mute" />
      </div>

      <Card className="mt-4">
        <h2 className="text-[13px] font-semibold">{L('لینک اختصاصی شما', 'Your personal link')}</h2>
        <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
          <input className="input flex-1" dir="ltr" readOnly value={link} onFocus={(event) => event.target.select()} />
          <button type="button" onClick={copyLink} className="btn btn-gold btn-sm sm:px-4">
            <Copy size={13} />
            {L('کپی لینک', 'Copy link')}
          </button>
        </div>
        <p className="mt-2 text-[10.5px] leading-relaxed text-mute/50">
          {L(
            'کمیسیون بر اساس قوانین برنامه معرفی توسط مدیر ثبت و تأیید می‌شود.',
            'Commission is recorded and approved by an administrator under the referral program rules.',
          )}
        </p>
      </Card>

      <div className="mt-3 grid gap-3 xl:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-[13px] font-semibold">{L('کاربران شما', 'Your users')}</h2>
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
                {
                  key: 'createdAt',
                  label: L('تاریخ عضویت', 'Joined'),
                  render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang, false)}</span>,
                },
              ]}
              empty={
                <div className="py-8 text-center text-[12px] text-mute/70">
                  {L('هنوز کاربری معرفی نکرده‌اید.', 'You have not referred anyone yet.')}
                </div>
              }
            />
          )}
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-[13px] font-semibold">{L('تاریخچه کمیسیون', 'Commission history')}</h2>
          </div>
          <Table
            rows={commissions}
            columns={[
              { key: 'amount', label: L('مبلغ', 'Amount'), render: (row) => <Money value={row.amount} /> },
              {
                key: 'rate',
                label: L('نرخ', 'Rate'),
                render: (row) => <span className="text-[11.5px] text-mute">{row.rate ? `${row.rate}%` : '—'}</span>,
              },
              { key: 'status', label: L('وضعیت', 'Status'), render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'createdAt',
                label: L('تاریخ', 'Date'),
                render: (row) => <span className="text-[11px] text-mute">{formatDate(row.createdAt, lang)}</span>,
              },
            ]}
            empty={
              <div className="py-8 text-center text-[12px] text-mute/70">
                {L('کمیسیونی ثبت نشده است.', 'No commission recorded.')}
              </div>
            }
          />
        </Card>
      </div>
    </Shell>
  );
}
