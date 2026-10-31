import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import { Button, Field, Modal, Spinner, useToast } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { useLang } from '../lib/lang.jsx';
import { post, ERROR_LABELS } from '../lib/api.js';

export default function Login() {
  const { L } = useLang();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const toast = useToast();

  const [form, setForm] = useState({ identifier: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotBusy, setForgotBusy] = useState(false);

  const next = params.get('next');

  useEffect(() => {
    if (user) navigate(next || (user.role === 'ADMIN' ? '/admin' : '/dashboard'), { replace: true });
  }, [user, navigate, next]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const account = await login(form.identifier.trim(), form.password);
      toast(L('خوش آمدید!', 'Welcome back!'));
      navigate(next || (account.role === 'ADMIN' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBusy(false);
    }
  };

  const requestReset = async (event) => {
    event.preventDefault();
    setForgotBusy(true);
    try {
      await post('/auth/forgot', { email: forgotEmail });
      toast(L('درخواست بازیابی ثبت شد؛ تیم پشتیبانی با شما تماس می‌گیرد.', 'Reset request recorded; support will contact you.'), 'info');
      setForgotOpen(false);
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
    } finally {
      setForgotBusy(false);
    }
  };

  return (
    <AuthLayout
      title={L('ورود به حساب', 'Sign in')}
      subtitle={L('برای دسترسی به داشبورد و کیف پول خود وارد شوید.', 'Sign in to reach your dashboard and wallet.')}
      footer={
        <>
          {L('حساب کاربری ندارید؟', 'No account yet?')}{' '}
          <Link to="/register" className="font-semibold text-gold hover:underline">
            {L('ثبت نام', 'Register')}
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label={L('ایمیل یا نام کاربری', 'Email or username')}>
          <input
            className="input"
            value={form.identifier}
            onChange={(event) => setForm({ ...form, identifier: event.target.value })}
            autoComplete="username"
            dir="ltr"
            placeholder="you@example.com"
            required
          />
        </Field>

        <Field label={L('رمز عبور', 'Password')}>
          <div className="relative">
            <input
              className="input pe-10"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete="current-password"
              dir="ltr"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-mute/60 transition hover:text-gold"
              aria-label={L('نمایش رمز عبور', 'Show password')}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-[11.5px]">
          <label className="flex cursor-pointer items-center gap-2 text-mute">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) => setForm({ ...form, remember: event.target.checked })}
              className="h-3.5 w-3.5 accent-[#E8B64E]"
            />
            {L('مرا به یاد بسپار', 'Remember me')}
          </label>
          <button type="button" onClick={() => setForgotOpen(true)} className="text-gold/80 hover:text-gold">
            {L('فراموشی رمز عبور', 'Forgot password?')}
          </button>
        </div>

        {error ? (
          <p className="rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
        ) : null}

        <Button type="submit" variant="gold" className="w-full" disabled={busy}>
          {busy ? <Spinner className="h-4 w-4" /> : <LogIn size={15} />}
          {L('ورود به حساب', 'Sign in')}
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-[11px] leading-relaxed text-mute/70">
        <p className="font-medium text-white/80">{L('حساب نمایشی (محیط توسعه)', 'Demo account (development)')}</p>
        <p className="mt-1" dir="ltr">
          demo / Demo@12345
        </p>
      </div>

      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title={L('بازیابی رمز عبور', 'Password recovery')}
        footer={
          <>
            <Button variant="soft" size="sm" onClick={() => setForgotOpen(false)}>
              {L('انصراف', 'Cancel')}
            </Button>
            <Button variant="gold" size="sm" onClick={requestReset} disabled={forgotBusy || !forgotEmail}>
              {forgotBusy ? <Spinner className="h-3.5 w-3.5" /> : null}
              {L('ثبت درخواست', 'Submit request')}
            </Button>
          </>
        }
      >
        <p className="text-[12.5px] leading-relaxed text-mute">
          {L(
            'ایمیل حساب خود را وارد کنید. درخواست شما برای تیم پشتیبانی ثبت می‌شود تا فرآیند بازیابی به‌صورت امن انجام شود.',
            'Enter your account email. Your request is logged for the support team so recovery can be handled securely.',
          )}
        </p>
        <Field label={L('ایمیل', 'Email')} className="mt-4">
          <input
            className="input"
            type="email"
            dir="ltr"
            value={forgotEmail}
            onChange={(event) => setForgotEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </Field>
      </Modal>
    </AuthLayout>
  );
}
