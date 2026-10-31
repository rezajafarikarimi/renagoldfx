import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import { Button, Field, Spinner, useToast } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { useLang } from '../lib/lang.jsx';
import { ERROR_LABELS } from '../lib/api.js';

const EMPTY = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  referralCode: '',
  acceptTerms: false,
};

export default function Register() {
  const { L } = useLang();
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const toast = useToast();

  const [form, setForm] = useState({ ...EMPTY, referralCode: params.get('ref') || '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
  }, [user, navigate]);

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError(ERROR_LABELS.password_mismatch);
      return;
    }
    setBusy(true);
    try {
      await register(form);
      toast(L('حساب شما ساخته شد. خوش آمدید!', 'Your account was created. Welcome!'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={L('ساخت حساب کاربری', 'Create your account')}
      subtitle={L('دسترسی به کیف پول، طرح‌ها و پشتیبانی در چند ثانیه.', 'Wallet, plans and support in a few seconds.')}
      footer={
        <>
          {L('قبلاً ثبت نام کرده‌اید؟', 'Already registered?')}{' '}
          <Link to="/login" className="font-semibold text-gold hover:underline">
            {L('ورود', 'Sign in')}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-3.5" noValidate>
        <Field label={L('نام و نام خانوادگی', 'Full name')}>
          <input className="input" value={form.fullName} onChange={set('fullName')} autoComplete="name" required />
        </Field>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label={L('نام کاربری', 'Username')}>
            <input
              className="input"
              value={form.username}
              onChange={set('username')}
              dir="ltr"
              autoComplete="username"
              placeholder="rena.trader"
              required
            />
          </Field>
          <Field label={L('شماره تماس', 'Phone')}>
            <input
              className="input"
              value={form.phone}
              onChange={set('phone')}
              dir="ltr"
              autoComplete="tel"
              placeholder="+98..."
            />
          </Field>
        </div>

        <Field label={L('ایمیل', 'Email')}>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={set('email')}
            dir="ltr"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </Field>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label={L('رمز عبور', 'Password')} hint={L('حداقل ۸ کاراکتر', 'At least 8 characters')}>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={set('password')}
              dir="ltr"
              autoComplete="new-password"
              required
            />
          </Field>
          <Field label={L('تکرار رمز عبور', 'Confirm password')}>
            <input
              className="input"
              type="password"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              dir="ltr"
              autoComplete="new-password"
              required
            />
          </Field>
        </div>

        <Field label={L('کد معرف (اختیاری)', 'Referral code (optional)')}>
          <input
            className="input"
            value={form.referralCode}
            onChange={set('referralCode')}
            dir="ltr"
            placeholder="RENA2026"
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-2 text-[11.5px] leading-relaxed text-mute">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={set('acceptTerms')}
            className="mt-0.5 h-3.5 w-3.5 accent-[#E8B64E]"
          />
          <span>
            {L('قوانین و شرایط و افشای ریسک را خوانده‌ام و می‌پذیرم.', 'I have read and accept the terms and risk disclosure.')}
          </span>
        </label>

        {error ? (
          <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
        ) : null}

        <Button type="submit" variant="gold" className="w-full" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <UserPlus size={15} />}
          {L('ساخت حساب', 'Create account')}
        </Button>
      </form>
    </AuthLayout>
  );
}
