import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Shell from '../components/Shell.jsx';
import { useLang } from '../lib/lang.jsx';

export default function NotFound() {
  const { L } = useLang();
  return (
    <Shell variant="public">
      <div className="panel flex flex-col items-center justify-center gap-3 p-12 text-center">
        <span className="rounded-2xl border border-gold/25 bg-gold/10 p-3 text-gold">
          <Compass size={22} />
        </span>
        <p className="text-3xl font-extrabold gold-text">404</p>
        <h1 className="text-lg font-semibold">{L('این صفحه پیدا نشد', 'Page not found')}</h1>
        <p className="max-w-sm text-[12.5px] leading-relaxed text-mute">
          {L('مسیر مورد نظر وجود ندارد یا جابه‌جا شده است.', 'The route does not exist or has moved.')}
        </p>
        <Link to="/" className="btn btn-gold btn-sm mt-2">
          {L('بازگشت به صفحه اصلی', 'Back to home')}
        </Link>
      </div>
    </Shell>
  );
}
