import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { X, CheckCircle2, AlertTriangle, Info, Inbox } from 'lucide-react';
import { useLang } from '../lib/lang.jsx';

/* --------------------------------- button --------------------------------- */

const BUTTON_VARIANTS = {
  gold: 'btn-gold',
  ghost: 'btn-ghost',
  soft: 'btn-soft',
  danger: 'btn-danger',
};

export function Button({
  to,
  href,
  variant = 'ghost',
  size,
  className = '',
  children,
  type = 'button',
  ...rest
}) {
  const classes = `btn ${BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.ghost} ${
    size === 'sm' ? 'btn-sm' : ''
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}

/* ---------------------------------- cards --------------------------------- */

export function Card({ className = '', children, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`panel p-5 ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/70">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-mute">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Stat({ label, value, hint, icon: Icon, tone = 'gold' }) {
  const toneClass =
    tone === 'up' ? 'text-up' : tone === 'down' ? 'text-down' : tone === 'mute' ? 'text-white' : 'text-gold';
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-mute">{label}</p>
        {Icon ? (
          <span className="rounded-lg border border-gold/20 bg-gold/10 p-1.5 text-gold">
            <Icon size={15} strokeWidth={1.7} />
          </span>
        ) : null}
      </div>
      <p className={`mt-3 text-xl font-semibold tracking-tight ${toneClass}`}>{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-mute/70">{hint}</p> : null}
    </div>
  );
}

/* -------------------------------- form bits ------------------------------- */

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      {label ? <label className="label">{label}</label> : null}
      {children}
      {error ? <p className="mt-1 text-[11px] text-down">{error}</p> : null}
      {!error && hint ? <p className="mt-1 text-[11px] text-mute/60">{hint}</p> : null}
    </div>
  );
}

/* --------------------------------- badges --------------------------------- */

const STATUS_LABELS = {
  PENDING: ['در انتظار', 'Pending'],
  APPROVED: ['تأیید شده', 'Approved'],
  REJECTED: ['رد شده', 'Rejected'],
  OPEN: ['باز', 'Open'],
  ANSWERED: ['پاسخ داده شده', 'Answered'],
  CLOSED: ['بسته', 'Closed'],
  ACTIVE: ['فعال', 'Active'],
  SUSPENDED: ['مسدود', 'Suspended'],
  UNVERIFIED: ['تأیید نشده', 'Unverified'],
  VERIFIED: ['تأیید شده', 'Verified'],
  PENDING_KYC: ['در حال بررسی', 'In review'],
  LOW: ['کم', 'Low'],
  NORMAL: ['عادی', 'Normal'],
  HIGH: ['بالا', 'High'],
};

const TONE_CLASSES = {
  gold: 'border-gold/30 bg-gold/10 text-gold',
  up: 'border-up/30 bg-up/10 text-up',
  down: 'border-down/30 bg-down/10 text-down',
  mute: 'border-white/15 bg-white/5 text-mute',
  info: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
};

export function Badge({ tone = 'mute', children, className = '' }) {
  return <span className={`chip ${TONE_CLASSES[tone] || TONE_CLASSES.mute} ${className}`}>{children}</span>;
}

export function StatusBadge({ status }) {
  const { lang } = useLang();
  const label = STATUS_LABELS[status];
  const tone =
    status === 'APPROVED' || status === 'ACTIVE' || status === 'VERIFIED' || status === 'ANSWERED'
      ? status === 'ANSWERED'
        ? 'info'
        : 'up'
      : status === 'REJECTED' || status === 'SUSPENDED'
        ? 'down'
        : status === 'PENDING' || status === 'OPEN'
          ? 'gold'
          : 'mute';
  return <Badge tone={tone}>{label ? (lang === 'fa' ? label[0] : label[1]) : status}</Badge>;
}

/* ---------------------------------- table --------------------------------- */

export function Table({ columns, rows, keyField = 'id', empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.label} className="table-head px-4 py-3 text-start">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2">
                {empty || <Empty />}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr
                key={row[keyField] ?? index}
                className="border-t border-white/[0.06] transition hover:bg-white/[0.025]"
              >
                {columns.map((column) => (
                  <td key={column.key || column.label} className="px-4 py-3 align-middle text-[13px]">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------- states --------------------------------- */

export function Empty({ title, description, action }) {
  const { L } = useLang();
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <span className="rounded-xl border border-gold/20 bg-gold/5 p-2.5 text-gold/70">
        <Inbox size={20} strokeWidth={1.6} />
      </span>
      <p className="text-sm font-medium text-white/85">{title || L('موردی وجود ندارد', 'Nothing here yet')}</p>
      <p className="max-w-sm text-xs leading-relaxed text-mute/70">
        {description || L('با ثبت اولین درخواست، این بخش تکمیل می‌شود.', 'This section fills up once you create your first record.')}
      </p>
      {action}
    </div>
  );
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-gold/30 border-t-gold ${className}`}
      aria-label="loading"
    />
  );
}

export function LoadingBlock({ label }) {
  const { L } = useLang();
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-mute">
      <Spinner />
      {label || L('در حال بارگذاری…', 'Loading…')}
    </div>
  );
}

/* ---------------------------------- tabs ---------------------------------- */

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="no-scrollbar -mx-1 mb-4 flex gap-1 overflow-x-auto px-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            value === tab.value
              ? 'border border-gold/35 bg-gold/10 text-gold'
              : 'border border-transparent text-mute hover:bg-white/5 hover:text-white'
          }`}
        >
          {tab.label}
          {tab.count !== undefined ? <span className="ms-1.5 text-[10px] opacity-70">{tab.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* --------------------------------- modal ---------------------------------- */

export function Modal({ open, onClose, title, children, footer, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" aria-label="close" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${width} animate-fade-up rounded-2xl border border-gold/20 bg-panel p-5 shadow-panel`}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-mute transition hover:border-white/25 hover:text-white"
            aria-label="close"
          >
            <X size={15} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pe-1">{children}</div>
        {footer ? <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ---------------------------------- toast --------------------------------- */

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((current) => [...current, { id, message, tone }]);
    setTimeout(() => setItems((current) => current.filter((item) => item.id !== id)), 4200);
  }, []);

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 end-4 z-[120] flex w-[min(92vw,340px)] flex-col gap-2">
        {items.map((item) => {
          const Icon = item.tone === 'error' ? AlertTriangle : item.tone === 'info' ? Info : CheckCircle2;
          const tone =
            item.tone === 'error'
              ? 'border-down/40 bg-down/10 text-down'
              : item.tone === 'info'
                ? 'border-sky-400/30 bg-sky-400/10 text-sky-200'
                : 'border-up/40 bg-up/10 text-up';
          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex animate-fade-up items-start gap-2 rounded-xl border ${tone} bg-panel/95 px-3.5 py-3 text-[13px] shadow-panel`}
            >
              <Icon size={16} className="mt-0.5 shrink-0" />
              <span className="text-white/90">{item.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}

/* ------------------------------ confirm dialog ----------------------------- */

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  danger,
  busy,
  note,
  noteValue = '',
  onNoteChange,
}) {
  const { L } = useLang();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="soft" size="sm" onClick={onClose}>
            {L('انصراف', 'Cancel')}
          </Button>
          <Button
            variant={danger ? 'danger' : 'gold'}
            size="sm"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? <Spinner className="h-3.5 w-3.5" /> : null}
            {confirmLabel || L('تأیید', 'Confirm')}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-mute">{description}</p>
      {note ? (
        <Field label={L('یادداشت (اختیاری)', 'Note (optional)')} className="mt-4">
          <textarea
            className="input min-h-[80px]"
            value={noteValue}
            onChange={(event) => onNoteChange?.(event.target.value)}
            placeholder={L('دلیل یا توضیح برای این اقدام', 'Reason or explanation for this action')}
          />
        </Field>
      ) : null}
    </Modal>
  );
}

/* --------------------------------- helpers -------------------------------- */

export function Money({ value, className = '', suffix = 'USD' }) {
  const number = Number(value || 0);
  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      <span className="ms-1 text-[10px] font-medium text-mute/70">{suffix}</span>
    </span>
  );
}

export function FieldId(prefix) {
  const id = useId();
  return `${prefix}-${id}`;
}
