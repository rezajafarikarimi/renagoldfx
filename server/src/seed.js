import bcrypt from 'bcryptjs';
import { query, tx } from './db.js';

const SERVICE_CARDS = [
  {
    icon: 'services',
    href: '/services',
    titleFa: 'معرفی خدمات',
    titleEn: 'Our Services',
    descFa: 'راهکارهای جامع برای موفقیت شما',
    descEn: 'Complete solutions for your success',
  },
  {
    icon: 'plans',
    href: '/investment',
    titleFa: 'طرح‌های درآمدی',
    titleEn: 'Income Plans',
    descFa: 'خدمات مالی و فرصت‌های سرمایه‌گذاری',
    descEn: 'Financial services and investment opportunities',
  },
  {
    icon: 'copy',
    href: '/copy-trade',
    titleFa: 'کپی ترید',
    titleEn: 'Copy Trade',
    descFa: 'معامله حرفه‌ای بدون نیاز به تجربه',
    descEn: 'Professional trading without experience',
  },
  {
    icon: 'prop',
    href: '/prop',
    titleFa: 'پراپ تریدینگ',
    titleEn: 'Prop Trading',
    descFa: 'چالش‌های واقعی، سرمایه واقعی',
    descEn: 'Real challenges, real capital',
  },
  {
    icon: 'loan',
    href: '/loan',
    titleFa: 'طرح وام',
    titleEn: 'Loan Plan',
    descFa: 'تأمین سرمایه برای رشد بیشتر',
    descEn: 'Funding to grow further',
  },
];

export async function seed() {
  const { rows } = await query('select count(*)::int as count from users');
  if (rows[0].count > 0) return;

  const adminHash = await bcrypt.hash('Admin@12345', 10);
  const demoHash = await bcrypt.hash('Demo@12345', 10);

  await tx(async (client) => {
    const admin = await client.query(
      `insert into users (full_name, username, email, phone, password_hash, role, kyc_status, referral_code)
       values ('RENA Administrator', 'admin', 'admin@rena.gold', '+0000000000', $1, 'ADMIN', 'VERIFIED', 'RENAADMIN')
       returning id`,
      [adminHash],
    );
    const adminId = admin.rows[0].id;

    const demo = await client.query(
      `insert into users (full_name, username, email, phone, password_hash, role, kyc_status, referral_code, referred_by)
       values ('Demo Trader', 'demo', 'demo@rena.gold', '+9800000000', $1, 'USER', 'VERIFIED', 'DEMO2026', $2)
       returning id`,
      [demoHash, adminId],
    );
    const demoId = demo.rows[0].id;

    await client.query('insert into wallets (user_id) values ($1)', [adminId]);
    await client.query(
      'insert into wallets (user_id, balance, available) values ($1, 5250, 3450)',
      [demoId],
    );

    const plans = await client.query(
      `insert into plans (code, name_fa, name_en, description_fa, description_en, min_amount, max_amount, roi_percent, duration_days, is_public, allocation_notes)
       values
         ('STARTER', 'طرح درآمدی استارتر', 'Starter Income Plan', 'شروع مسیر سرمایه‌گذاری با سرمایه محدود و بازدهی ماهانه شفاف.', 'Start investing with a small ticket and a transparent monthly return.', 100, 999, 1.8, 30, true, null),
         ('GROWTH', 'طرح درآمدی رشد', 'Growth Income Plan', 'برای سرمایه‌گذارانی که به دنبال بازدهی بیشتر در بازه میان‌مدت هستند.', 'For investors looking for stronger mid-term returns.', 1000, 9999, 2.4, 60, true, null),
         ('POOL1', 'Pool1 — مخزن مدیریتی', 'Pool1 — Internal Pool', 'طرح داخلی مدیریت سرمایه. دسترسی صرفاً برای مدیران.', 'Internal capital allocation pool. Administrator access only.', 0, null, null, null, false, 'Pool1 internal allocation — confidential. Never expose to ordinary users.')
       returning id, code`,
    );
    const starterId = plans.rows.find((p) => p.code === 'STARTER').id;

    await client.query(
      `insert into transactions (user_id, kind, amount, status, reference, description, created_at, processed_at, processed_by)
       values
         ($1, 'DEPOSIT', 5000, 'APPROVED', 'SEED-DEP-1', 'Initial funding', now() - interval '12 days', now() - interval '12 days', $2),
         ($1, 'COMMISSION', 250, 'APPROVED', 'SEED-COM-1', 'Referral commission', now() - interval '6 days', now() - interval '6 days', $2)`,
      [demoId, adminId],
    );

    const pendingWithdrawal = await client.query(
      `insert into transactions (user_id, kind, amount, status, reference, description)
       values ($1, 'WITHDRAWAL', 800, 'PENDING', 'USDT-TRC20', 'Withdrawal request')
       returning id`,
      [demoId],
    );
    await client.query(
      `insert into withdrawal_requests (user_id, amount, destination, transaction_id)
       values ($1, 800, 'USDT TRC20 — TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', $2)`,
      [demoId, pendingWithdrawal.rows[0].id],
    );

    const pendingInvestment = await client.query(
      `insert into transactions (user_id, kind, amount, status, reference, description)
       values ($1, 'INVESTMENT', 1000, 'PENDING', 'STARTER', 'Investment request')
       returning id`,
      [demoId],
    );
    await client.query(
      `insert into investment_requests (user_id, plan_id, amount, notes, transaction_id)
       values ($1, $2, 1000, 'Seed investment request', $3)`,
      [demoId, starterId, pendingInvestment.rows[0].id],
    );

    await client.query(
      `insert into support_tickets (user_id, subject, category, status)
       values ($1, 'سوال درباره چالش پراپ تریدینگ', 'PROP', 'OPEN')`,
      [demoId],
    );
    const ticket = await client.query('select id from support_tickets limit 1');
    await client.query(
      `insert into support_messages (ticket_id, author_id, is_staff, body)
       values ($1, $2, false, 'سلام، برای شروع چالش پراپ تریدینگ چه مدرکی لازم است؟')`,
      [ticket.rows[0].id, demoId],
    );

    await client.query(
      `insert into notifications (user_id, title, body)
       values ($1, 'به RENA خوش آمدید', 'حساب شما با موفقیت ایجاد شد. برای شروع، کیف پول خود را شارژ کنید.')`,
      [demoId],
    );

    await client.query(
      `insert into banners (title_fa, title_en, subtitle_fa, subtitle_en, cta_label, cta_href, sort)
       values
         ('با هم، به سوی آزادی مالی', 'Together towards financial freedom', 'پلتفرم معاملاتی RENA — دو ذهن، یک چشم‌انداز', 'RENA trading platform — two minds, one vision', 'شروع کنید', '/register', 1),
         ('کپی ترید حرفه‌ای', 'Professional copy trading', 'مسیر تریدرهای حرفه‌ای را دقیقاً دنبال کنید', 'Follow professional traders with precision', 'مشاهده کپی ترید', '/copy-trade', 2),
         ('پراپ تریدینگ RENA', 'RENA prop trading', 'چالش‌های واقعی؛ سرمایه واقعی برای رشد شما', 'Real challenges, real capital to grow', 'شروع چالش', '/prop', 3)`,
    );

    await client.query(
      `insert into site_settings (key, value) values
         ('announcement', $1::jsonb),
         ('service_cards', $2::jsonb),
         ('market_source', $3::jsonb),
         ('contact', $4::jsonb)`,
      [
        JSON.stringify('به پلتفرم معاملاتی RENA خوش آمدید — پشتیبانی ۲۴/۷ در کنار شماست.'),
        JSON.stringify(SERVICE_CARDS),
        JSON.stringify('auto'),
        JSON.stringify({
          email: 'support@rena.gold',
          phone: '+98 21 0000 0000',
          telegram: 'https://t.me/rena',
          hours: 'پشتیبانی ۲۴ ساعته، ۷ روز هفته',
        }),
      ],
    );

    await client.query(
      `insert into audit_logs (actor_id, action, target_type, target_id, meta)
       values ($1, 'system.seed', 'system', null, $2::jsonb)`,
      [adminId, JSON.stringify({ users: 2, plans: 3 })],
    );
  });
}
