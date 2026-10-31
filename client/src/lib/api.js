import { useCallback, useEffect, useRef, useState } from 'react';

export class ApiError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await response.text();
  let data = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(data?.error || 'request_failed', response.status);
  }
  return data;
}

export const get = (path) => request(path);
export const post = (path, body) => request(path, { method: 'POST', body });
export const patch = (path, body) => request(path, { method: 'PATCH', body });

export function useApi(path, { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!enabled || !path) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await get(path);
      if (mounted.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (mounted.current) setState({ data: null, loading: false, error: error.code || 'failed' });
    }
  }, [path, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

export function formatMoney(value, decimals = 2) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

export function formatPrice(value, decimals = 2) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDate(value, lang = 'fa', withTime = true) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', {
      dateStyle: 'medium',
      ...(withTime ? { timeStyle: 'short' } : {}),
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 16).replace('T', ' ');
  }
}

export function formatDateShort(value, lang = 'fa') {
  return formatDate(value, lang, false);
}

export const ERROR_LABELS = {
  auth_required: 'برای ادامه باید وارد حساب شوید.',
  invalid_credentials: 'ایمیل/نام کاربری یا رمز عبور نادرست است.',
  account_inactive: 'دسترسی این حساب غیرفعال شده است.',
  already_exists: 'ایمیل یا نام کاربری قبلاً ثبت شده است.',
  invalid_name: 'نام و نام خانوادگی معتبر نیست.',
  invalid_email: 'ایمیل معتبر نیست.',
  invalid_username: 'نام کاربری باید ۳ تا ۲۴ کاراکتر شامل حروف و عدد باشد.',
  weak_password: 'رمز عبور باید حداقل ۸ کاراکتر باشد.',
  password_mismatch: 'تکرار رمز عبور مطابقت ندارد.',
  terms_required: 'پذیرش قوانین الزامی است.',
  invalid_amount: 'مبلغ وارد شده معتبر نیست.',
  amount_too_large: 'مبلغ وارد شده بیش از حد مجاز است.',
  insufficient_funds: 'موجودی قابل استفاده کافی نیست.',
  invalid_destination: 'مقصد برداشت را کامل وارد کنید.',
  invalid_plan: 'طرح انتخاب شده معتبر نیست.',
  below_minimum: 'مبلغ کمتر از حداقل طرح است.',
  above_maximum: 'مبلغ بیشتر از حداکثر طرح است.',
  invalid_service: 'سرویس انتخاب شده معتبر نیست.',
  invalid_account: 'شناسه حساب را وارد کنید.',
  invalid_subject: 'موضوع تیکت را وارد کنید.',
  invalid_message: 'متن پیام را وارد کنید.',
  ticket_closed: 'این تیکت بسته شده است.',
  email_in_use: 'این ایمیل قبلاً استفاده شده است.',
  invalid_password: 'رمز عبور فعلی نادرست است.',
  invalid_status: 'وضعیت انتخاب شده معتبر نیست.',
  invalid_role: 'نقش انتخاب شده معتبر نیست.',
  invalid_kyc: 'وضعیت احراز هویت معتبر نیست.',
  cannot_modify_self: 'امکان تغییر نقش یا وضعیت حساب خودتان وجود ندارد.',
  already_reviewed: 'این درخواست قبلاً بررسی شده است.',
  insufficient_balance: 'موجودی حساب کاربر برای این تأیید کافی نیست.',
  forbidden: 'شما به این بخش دسترسی ندارید.',
  request_failed: 'درخواست انجام نشد. دوباره تلاش کنید.',
  server_error: 'خطای سرور. دوباره تلاش کنید.',
  failed: 'ارتباط با سرور برقرار نشد.',
};
