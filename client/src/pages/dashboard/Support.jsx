import { useEffect, useState } from 'react';
import { LifeBuoy, Plus, Send, MessageSquare, Clock3 } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Button,
  Card,
  Field,
  LoadingBlock,
  Modal,
  PageHeader,
  Spinner,
  StatusBadge,
  useToast,
} from '../../components/ui.jsx';
import { get, post, useApi, formatDate, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const CATEGORIES = [
  ['GENERAL', 'عمومی', 'General'],
  ['DEPOSIT', 'واریز و برداشت', 'Deposit & withdrawal'],
  ['INVESTMENT', 'سرمایه‌گذاری', 'Investment'],
  ['PROP', 'پراپ تریدینگ', 'Prop trading'],
  ['COPY', 'کپی ترید', 'Copy trading'],
  ['LOAN', 'وام', 'Loan'],
  ['SECURITY', 'امنیت حساب', 'Account security'],
];

export default function Support() {
  const { L, lang } = useLang();
  const toast = useToast();
  const { data, loading, reload } = useApi('/support/tickets');
  const [selectedId, setSelectedId] = useState(null);
  const [thread, setThread] = useState(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [busy, setBusy] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'GENERAL', message: '' });
  const [error, setError] = useState('');

  const tickets = data?.tickets || [];

  useEffect(() => {
    if (!selectedId) {
      setThread(null);
      return;
    }
    let alive = true;
    setThreadLoading(true);
    get(`/support/tickets/${selectedId}`)
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

  const openTicket = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const created = await post('/support/tickets', form);
      toast(L('تیکت ثبت شد.', 'Ticket created.'), 'info');
      setCreateOpen(false);
      setForm({ subject: '', category: 'GENERAL', message: '' });
      await reload();
      setSelectedId(created.id);
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!reply.trim()) return;
    setBusy(true);
    try {
      await post(`/support/tickets/${selectedId}/messages`, { body: reply });
      setReply('');
      const result = await get(`/support/tickets/${selectedId}`);
      setThread(result);
      reload();
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell variant="user">
      <PageHeader
        eyebrow={L('پشتیبانی', 'Support')}
        title={L('تیکت‌های پشتیبانی', 'Support tickets')}
        description={L(
          'تیکت جدید ثبت کنید و پاسخ کارشناسان RENA را در همین صفحه ببینید.',
          'Open a ticket and read the RENA specialists’ replies right here.',
        )}
        actions={
          <Button variant="gold" size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} />
            {L('تیکت جدید', 'New ticket')}
          </Button>
        }
      />

      {loading ? (
        <LoadingBlock />
      ) : (
        <div className="grid gap-3 xl:grid-cols-[0.85fr_1.4fr]">
          <Card className="p-0">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <MessageSquare size={14} className="text-gold" />
              <h2 className="text-[13px] font-semibold">{L('تیکت‌های شما', 'Your tickets')}</h2>
              <span className="ms-auto text-[11px] text-mute/50">{tickets.length}</span>
            </div>
            <div className="max-h-[520px] space-y-1 overflow-y-auto p-2">
              {tickets.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-[12px] text-mute/70">{L('تیکتی ثبت نشده است.', 'No tickets yet.')}</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setCreateOpen(true)}>
                    {L('ثبت اولین تیکت', 'Create your first ticket')}
                  </Button>
                </div>
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
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-mute/50">
                      <Clock3 size={10} />
                      {formatDate(ticket.updatedAt, lang)} · {ticket.messageCount}{' '}
                      {L('پیام', 'messages')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </Card>

          <Card className="flex min-h-[420px] flex-col p-0">
            {!selectedId ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <span className="rounded-xl border border-gold/20 bg-gold/5 p-2.5 text-gold/70">
                  <LifeBuoy size={20} />
                </span>
                <p className="text-[13px] font-medium text-white/85">
                  {L('یک تیکت را انتخاب کنید', 'Select a ticket')}
                </p>
                <p className="max-w-xs text-[11.5px] leading-relaxed text-mute/60">
                  {L('گفتگو و پاسخ کارشناس در این بخش نمایش داده می‌شود.', 'The conversation and specialist replies appear here.')}
                </p>
              </div>
            ) : threadLoading || !thread ? (
              <LoadingBlock />
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-[13px] font-semibold">{thread.ticket.subject}</h2>
                    <p className="mt-0.5 text-[10.5px] text-mute/60">
                      {formatDate(thread.ticket.createdAt, lang)}
                    </p>
                  </div>
                  <StatusBadge status={thread.ticket.status} />
                </div>

                <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
                  {(thread.messages || []).map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[86%] rounded-xl border px-3 py-2.5 ${
                        message.isStaff
                          ? 'ms-auto border-gold/25 bg-gold/[0.07]'
                          : 'border-white/[0.08] bg-white/[0.03]'
                      }`}
                    >
                      <p className="text-[10px] font-medium text-mute/60">
                        {message.isStaff ? L('پشتیبانی RENA', 'RENA support') : message.authorName || L('شما', 'You')}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-[12.5px] leading-relaxed text-white/90">
                        {message.body}
                      </p>
                      <p className="mt-1 text-[9.5px] text-mute/40">{formatDate(message.createdAt, lang)}</p>
                    </div>
                  ))}
                </div>

                {thread.ticket.status === 'CLOSED' ? (
                  <p className="border-t border-white/[0.06] px-4 py-3 text-[11.5px] text-mute">
                    {L('این تیکت بسته شده است. برای ادامه، تیکت جدید ثبت کنید.', 'This ticket is closed. Create a new one to continue.')}
                  </p>
                ) : (
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
                )}
              </>
            )}
          </Card>
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={L('تیکت جدید', 'New ticket')}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setCreateOpen(false)}>
              {L('انصراف', 'Cancel')}
            </Button>
            <Button variant="gold" size="sm" onClick={openTicket} disabled={busy}>
              {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
              {L('ثبت تیکت', 'Create ticket')}
            </Button>
          </>
        }
      >
        <form onSubmit={openTicket} className="space-y-3.5">
          <Field label={L('موضوع', 'Subject')}>
            <input
              className="input"
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
              required
            />
          </Field>
          <Field label={L('دسته‌بندی', 'Category')}>
            <select
              className="input"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              {CATEGORIES.map(([value, fa, en]) => (
                <option key={value} value={value}>
                  {L(fa, en)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={L('پیام', 'Message')}>
            <textarea
              className="input min-h-[110px]"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              required
            />
          </Field>
          {error ? (
            <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
          ) : null}
        </form>
      </Modal>
    </Shell>
  );
}
