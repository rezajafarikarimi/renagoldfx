import { useEffect, useState } from 'react';
import { LifeBuoy, Send, MessageSquare } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  LoadingBlock,
  PageHeader,
  Spinner,
  StatusBadge,
  Tabs,
  useToast,
} from '../../components/ui.jsx';
import { get, post, patch, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

export default function AdminSupport() {
  const { L, lang } = useLang();
  const toast = useToast();
  const [status, setStatus] = useState('');
  const { data, loading, reload } = useApi(`/admin/support/tickets?status=${status}`);
  const [selectedId, setSelectedId] = useState(null);
  const [thread, setThread] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);

  const tickets = data?.tickets || [];

  useEffect(() => {
    if (!selectedId) {
      setThread(null);
      return;
    }
    let alive = true;
    setThreadLoading(true);
    get(`/admin/support/tickets/${selectedId}`)
      .then((result) => {
        if (alive) setThread(result);
      })
      .catch(() => {
        if (alive) setThread(null);
      })
      .finally(() => {
        if (alive) setThreadLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [selectedId]);

  const sendReply = async (event) => {
    event.preventDefault();
    if (!reply.trim()) return;
    setBusy(true);
    try {
      await post(`/admin/support/tickets/${selectedId}/messages`, { body: reply });
      setReply('');
      setThread(await get(`/admin/support/tickets/${selectedId}`));
      reload();
      toast(L('پاسخ ارسال شد.', 'Reply sent.'));
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
    } finally {
      setBusy(false);
    }
  };

  const changeStatus = async (next) => {
    setBusy(true);
    try {
      await patch(`/admin/support/tickets/${selectedId}`, { status: next });
      setThread(await get(`/admin/support/tickets/${selectedId}`));
      reload();
      toast(L('وضعیت تیکت تغییر کرد.', 'Ticket status updated.'), 'info');
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell variant="admin">
      <PageHeader
        eyebrow={L('پشتیبانی', 'Support')}
        title={L('تیکت‌های پشتیبانی', 'Support tickets')}
        description={L(
          'به تیکت کاربران پاسخ دهید و وضعیت آن‌ها را مدیریت کنید.',
          'Reply to user tickets and manage their status.',
        )}
      />

      <Tabs
        value={status}
        onChange={(value) => {
          setStatus(value);
          setSelectedId(null);
        }}
        tabs={[
          { value: '', label: L('همه', 'All') },
          { value: 'OPEN', label: L('باز', 'Open') },
          { value: 'ANSWERED', label: L('پاسخ داده شده', 'Answered') },
          { value: 'CLOSED', label: L('بسته', 'Closed') },
        ]}
      />

      <div className="grid gap-3 xl:grid-cols-[0.9fr_1.4fr]">
        <Card className="p-0">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <MessageSquare size={14} className="text-gold" />
            <h2 className="text-[13px] font-semibold">{L('فهرست تیکت‌ها', 'Ticket list')}</h2>
            <span className="ms-auto text-[11px] text-mute/50">{tickets.length}</span>
          </div>
          {loading ? (
            <LoadingBlock />
          ) : (
            <div className="max-h-[520px] space-y-1 overflow-y-auto p-2">
              {tickets.length === 0 ? (
                <p className="py-8 text-center text-[12px] text-mute/60">{L('تیکتی نیست.', 'No tickets.')}</p>
              ) : (
                tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedId(ticket.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-start transition ${
                      selectedId === ticket.id
                        ? 'border-gold/40 bg-gold/10'
                        : 'border-white/[0.06] hover:border-white/15 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12.5px] font-medium text-white/90">{ticket.subject}</p>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="mt-1 truncate text-[10px] text-mute/50">
                      @{ticket.username} · {ticket.category} · {formatDate(ticket.updatedAt, lang)}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </Card>

        <Card className="flex min-h-[420px] flex-col p-0">
          {!selectedId ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
              <span className="rounded-xl border border-gold/20 bg-gold/5 p-2.5 text-gold/70">
                <LifeBuoy size={20} />
              </span>
              <p className="text-[13px] font-medium text-white/85">{L('یک تیکت را انتخاب کنید', 'Select a ticket')}</p>
            </div>
          ) : threadLoading || !thread ? (
            <LoadingBlock />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-semibold">{thread.ticket.subject}</h2>
                  <p className="mt-0.5 text-[10.5px] text-mute/60">
                    {thread.ticket.fullName} · @{thread.ticket.username} · {thread.ticket.email}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusBadge status={thread.ticket.status} />
                  <select
                    className="input w-auto py-1.5 text-[11px]"
                    value={thread.ticket.status}
                    onChange={(event) => changeStatus(event.target.value)}
                    disabled={busy}
                  >
                    <option value="OPEN">{L('باز', 'Open')}</option>
                    <option value="ANSWERED">{L('پاسخ داده شده', 'Answered')}</option>
                    <option value="CLOSED">{L('بسته', 'Closed')}</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
                {(thread.messages || []).map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[86%] rounded-xl border px-3 py-2.5 ${
                      message.isStaff ? 'ms-auto border-gold/25 bg-gold/[0.07]' : 'border-white/[0.08] bg-white/[0.03]'
                    }`}
                  >
                    <p className="text-[10px] font-medium text-mute/60">
                      {message.isStaff ? L('پشتیبانی RENA', 'RENA support') : message.authorName || L('کاربر', 'User')}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed text-white/90">{message.body}</p>
                    <p className="mt-1 text-[9.5px] text-mute/40">{formatDate(message.createdAt, lang)}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={sendReply} className="border-t border-white/[0.06] p-3">
                <div className="flex items-end gap-2">
                  <textarea
                    className="input min-h-[44px] flex-1 resize-none"
                    rows={2}
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={L('پاسخ خود را بنویسید…', 'Write your reply…')}
                  />
                  <Button type="submit" variant="gold" disabled={busy || !reply.trim()}>
                    {busy ? <Spinner className="h-3.5 w-3.5" /> : <Send size={14} />}
                  </Button>
                </div>
              </form>
            </>
          )}
        </Card>
      </div>
    </Shell>
  );
}
