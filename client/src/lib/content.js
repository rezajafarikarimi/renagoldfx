const t = (fa, en) => ({ fa, en });

export const contentPages = {
  services: {
    eyebrow: t('خدمات RENA', 'RENA services'),
    title: t('راهکارهای جامع برای موفقیت شما', 'Complete solutions for your success'),
    intro: t(
      'RENA TRADING COUPLE مجموعه‌ای یکپارچه از ابزارهای معاملاتی، سرمایه‌گذاری و آموزشی است که با زیرساخت امن و گزارش‌های شفاف در کنار شماست.',
      'RENA TRADING COUPLE brings trading, investment and education together with a secure infrastructure and transparent reporting.',
    ),
    items: [
      {
        icon: 'copy',
        title: t('کپی ترید', 'Copy trading'),
        body: t(
          'عملکرد تریدرهای منتخب را دنبال کنید و بدون نیاز به تجربه، با ساختار مدیریت ریسک معامله کنید.',
          'Follow selected traders and trade with a risk-managed structure — no prior experience required.',
        ),
      },
      {
        icon: 'prop',
        title: t('پراپ تریدینگ', 'Prop trading'),
        body: t(
          'چالش‌های ارزیابی واقعی برای دسترسی به سرمایه پلتفرم، با قوانین شفاف و گزارش عملکرد.',
          'Real evaluation challenges for access to platform capital, with transparent rules and performance reporting.',
        ),
      },
      {
        icon: 'plans',
        title: t('طرح‌های درآمدی', 'Income plans'),
        body: t(
          'طرح‌های سرمایه‌گذاری با بازه‌های زمانی مشخص؛ جزئیات کامل هر طرح پیش از درخواست نمایش داده می‌شود.',
          'Time-bound investment plans with full details shown before you submit a request.',
        ),
      },
      {
        icon: 'loan',
        title: t('تأمین سرمایه', 'Capital funding'),
        body: t(
          'درخواست وام و تأمین سرمایه با بررسی وضعیت حساب و سابقه فعالیت شما.',
          'Loan and funding requests reviewed against your account status and activity history.',
        ),
      },
      {
        icon: 'support',
        title: t('پشتیبانی ۲۴/۷', '24/7 support'),
        body: t(
          'سیستم تیکت داخلی با پیگیری وضعیت، پاسخ کارشناس و تاریخچه کامل گفتگو.',
          'An internal ticket system with status tracking, specialist replies and a full conversation history.',
        ),
      },
      {
        icon: 'education',
        title: t('آموزش و خدمات مالی', 'Education & financial services'),
        body: t(
          'محتوای آموزشی ساختاریافته برای مدیریت ریسک، روانشناسی معامله و تحلیل بازار.',
          'Structured education on risk management, trading psychology and market analysis.',
        ),
      },
    ],
    cta: { href: '/register', label: t('ساخت حساب کاربری', 'Create your account') },
  },

  'copy-trade': {
    eyebrow: t('کپی ترید', 'Copy trading'),
    title: t('معامله حرفه‌ای بدون نیاز به تجربه', 'Professional trading without experience'),
    intro: t(
      'با کپی ترید RENA تصمیم‌گیری معاملاتی را به تریدرهای منتخب می‌سپارید؛ شما سطح ریسک و سرمایه خود را کنترل می‌کنید.',
      'With RENA copy trading you delegate trading decisions to selected traders while keeping control of your capital and risk level.',
    ),
    items: [
      {
        icon: 'search',
        title: t('انتخاب تریدر', 'Choose a trader'),
        body: t('پروفایل عملکرد، حداکثر افت سرمایه و تعداد معاملات هر تریدر را مقایسه کنید.', 'Compare performance, maximum drawdown and trade count for each trader.'),
      },
      {
        icon: 'shield',
        title: t('مدیریت ریسک', 'Risk management'),
        body: t('حداکثر درصد ریسک هر معامله و حد ضرر حساب را خودتان تعیین می‌کنید.', 'You set the maximum risk per trade and the account stop-loss.'),
      },
      {
        icon: 'chart',
        title: t('گزارش شفاف', 'Transparent reporting'),
        body: t('هر فعالیت معاملاتی در پنل شما ثبت و قابل پیگیری است.', 'Every trading activity is recorded and traceable in your dashboard.'),
      },
      {
        icon: 'clock',
        title: t('شروع سریع', 'Start quickly'),
        body: t('پس از تأیید حساب، درخواست اتصال را ثبت کنید و وضعیت آن را از داشبورد پیگیری کنید.', 'Once your account is verified, submit an activation request and follow its status from your dashboard.'),
      },
    ],
    cta: { href: '/dashboard/trading', label: t('ثبت درخواست کپی ترید', 'Submit a copy-trade request') },
  },

  prop: {
    eyebrow: t('پراپ تریدینگ', 'Prop trading'),
    title: t('چالش‌های واقعی، سرمایه واقعی', 'Real challenges, real capital'),
    intro: t(
      'برنامه پراپ RENA برای تریدرهایی است که می‌خواهند با مدیریت ریسک منظم، به سرمایه پلتفرم دسترسی پیدا کنند.',
      'RENA prop is built for traders who want access to platform capital through disciplined risk management.',
    ),
    items: [
      {
        icon: 'target',
        title: t('چالش ارزیابی', 'Evaluation challenge'),
        body: t('اهداف سود و حداکثر افت روزانه و کلی، پیش از شروع به‌صورت شفاف اعلام می‌شود.', 'Profit targets and daily/total drawdown limits are published before you start.'),
      },
      {
        icon: 'chart',
        title: t('حساب اختصاصی', 'Dedicated account'),
        body: t('پس از پذیرش، حساب معاملاتی اختصاصی شما فعال می‌شود.', 'After approval, your dedicated trading account is activated.'),
      },
      {
        icon: 'split',
        title: t('تقسیم سود', 'Profit split'),
        body: t('نسبت تقسیم سود بر اساس سطح حساب و قوانین برنامه تعیین می‌شود.', 'The profit split depends on your account tier and program rules.'),
      },
      {
        icon: 'shield',
        title: t('انضباط ریسک', 'Risk discipline'),
        body: t('نقض قوانین افت سرمایه به معنی پایان چالش است؛ بدون استثنا.', 'Breaching drawdown rules ends the challenge — no exceptions.'),
      },
    ],
    cta: { href: '/dashboard/trading', label: t('شروع چالش پراپ', 'Start a prop challenge') },
  },

  investment: {
    eyebrow: t('سرمایه‌گذاری', 'Investment'),
    title: t('طرح‌های درآمدی با جزئیات کامل', 'Income plans with full detail'),
    intro: t(
      'طرح‌های عمومی RENA با حداقل و حداکثر سرمایه، بازه زمانی و هدف بازدهی مشخص ارائه می‌شوند. هر درخواست پیش از فعال‌سازی توسط تیم مالی بررسی می‌شود.',
      'RENA public plans publish minimum and maximum capital, duration and a return target. Every request is reviewed by the finance team before activation.',
    ),
    items: [
      {
        icon: 'plans',
        title: t('انتخاب طرح', 'Choose a plan'),
        body: t('طرح‌ها را با حداقل سرمایه، مدت و هدف بازدهی مقایسه کنید.', 'Compare plans by minimum capital, duration and return target.'),
      },
      {
        icon: 'wallet',
        title: t('درخواست سرمایه‌گذاری', 'Investment request'),
        body: t('مبلغ از موجودی قابل استفاده رزرو و در دفتر تراکنش‌ها ثبت می‌شود.', 'The amount is reserved from your available balance and recorded in the ledger.'),
      },
      {
        icon: 'check',
        title: t('بررسی و تأیید', 'Review and approval'),
        body: t('وضعیت درخواست شما در داشبورد به‌روزرسانی می‌شود؛ هیچ تراکنشی خودکار تأیید نمی‌شود.', 'Your request status updates in the dashboard; no transaction is auto-approved.'),
      },
      {
        icon: 'chart',
        title: t('پیگیری', 'Tracking'),
        body: t('تاریخچه کامل درخواست‌ها و تراکنش‌ها همیشه در دسترس شماست.', 'The complete history of requests and transactions is always available to you.'),
      },
    ],
    cta: { href: '/dashboard/plans', label: t('مشاهده طرح‌های درآمدی', 'View income plans') },
  },

  loan: {
    eyebrow: t('وام', 'Loan'),
    title: t('تأمین سرمایه برای رشد بیشتر', 'Funding to grow further'),
    intro: t(
      'طرح وام RENA برای کاربران فعال با سابقه معاملاتی و وضعیت احراز هویت تأییدشده طراحی شده است.',
      'The RENA loan plan is designed for active users with a trading history and verified identity.',
    ),
    items: [
      {
        icon: 'check',
        title: t('پیش‌نیازها', 'Requirements'),
        body: t('احراز هویت تأییدشده، حداقل سابقه فعالیت و وضعیت حساب فعال.', 'Verified identity, a minimum activity history and an active account status.'),
      },
      {
        icon: 'wallet',
        title: t('سقف وام', 'Loan ceiling'),
        body: t('سقف بر اساس سطح حساب و گردش مالی شما تعیین می‌شود.', 'The ceiling is based on your account tier and turnover.'),
      },
      {
        icon: 'clock',
        title: t('بازپرداخت', 'Repayment'),
        body: t('شرایط بازپرداخت پیش از پذیرش، به‌صورت مکتوب اعلام می‌شود.', 'Repayment terms are provided in writing before you accept.'),
      },
      {
        icon: 'support',
        title: t('درخواست', 'Request'),
        body: t('برای بررسی شرایط، تیکت پشتیبانی با دسته «وام» ثبت کنید.', 'To review your eligibility, open a support ticket in the “Loan” category.'),
      },
    ],
    cta: { href: '/dashboard/support', label: t('ثبت درخواست وام', 'Request a loan') },
  },

  about: {
    eyebrow: t('درباره ما', 'About us'),
    title: t('دو ذهن، یک چشم‌انداز', 'Two minds, one vision'),
    intro: t(
      'RENA TRADING COUPLE یک پلتفرم معاملاتی است که فناوری، انضباط ریسک و شفافیت مالی را در یک تجربه یکپارچه ترکیب می‌کند.',
      'RENA TRADING COUPLE is a trading platform that combines technology, risk discipline and financial transparency in one experience.',
    ),
    items: [
      {
        icon: 'target',
        title: t('مأموریت ما', 'Our mission'),
        body: t('دسترسی به ابزارهای حرفه‌ای بازارهای جهانی با تجربه‌ای ساده و قابل اعتماد.', 'Access to professional global-market tools through a simple, dependable experience.'),
      },
      {
        icon: 'shield',
        title: t('اصول ما', 'Our principles'),
        body: t('شفافیت در هر تراکنش، کنترل دسترسی سمت سرور و گزارش‌پذیری کامل.', 'Transparency in every transaction, server-side access control and full auditability.'),
      },
      {
        icon: 'users',
        title: t('تیم', 'Team'),
        body: t('ترکیبی از تجربه معاملاتی، مهندسی نرم‌افزار و مدیریت مالی.', 'A blend of trading experience, software engineering and financial management.'),
      },
      {
        icon: 'education',
        title: t('آموزش', 'Education'),
        body: t('آموزش مستمر، بخشی از محصول است نه یک افزونه تبلیغاتی.', 'Ongoing education is part of the product, not a marketing add-on.'),
      },
    ],
    cta: { href: '/contact', label: t('تماس با ما', 'Contact us') },
  },

  faq: {
    eyebrow: t('سوالات متداول', 'FAQ'),
    title: t('پاسخ پرسش‌های رایج', 'Answers to common questions'),
    intro: t(
      'اگر پاسخ سؤال خود را پیدا نکردید، از طریق بخش پشتیبانی تیکت ثبت کنید.',
      'If you cannot find your answer, open a ticket from the support section.',
    ),
    faq: [
      {
        q: t('آیا قیمت‌های نوار بازار واقعی هستند؟', 'Are the prices in the market bar real?'),
        a: t(
          'نوار بازار داده‌ها را از منابع عمومی دریافت می‌کند. اگر اتصال برقرار نشود، برچسب «داده نمایشی» نمایش داده می‌شود و هیچ قیمتی به‌عنوان داده زنده ارائه نمی‌شود.',
          'The market bar pulls from public data sources. If the connection fails, a “demo data” badge is shown and no price is presented as live.',
        ),
      },
      {
        q: t('چطور حساب بسازم؟', 'How do I create an account?'),
        a: t(
          'از صفحه ثبت‌نام، نام، ایمیل، شماره تماس و رمز عبور را وارد کنید. پس از ورود، داشبورد کاربری شما فعال می‌شود.',
          'Use the registration page with your name, email, phone and password. Your dashboard becomes available right after you sign in.',
        ),
      },
      {
        q: t('واریز و برداشت چگونه انجام می‌شود؟', 'How do deposits and withdrawals work?'),
        a: t(
          'هر واریز یا برداشت به‌صورت درخواست ثبت می‌شود و پس از بررسی تیم مالی تأیید یا رد می‌شود. وضعیت در کیف پول شما قابل پیگیری است.',
          'Every deposit or withdrawal is submitted as a request and reviewed by the finance team. You can follow its status in your wallet.',
        ),
      },
      {
        q: t('آیا بازدهی طرح‌ها تضمینی است؟', 'Are plan returns guaranteed?'),
        a: t(
          'خیر. اعداد طرح‌ها هدف بازدهی هستند، نه تضمین. معامله در بازارهای مالی ریسک از دست دادن سرمایه دارد.',
          'No. Plan figures are return targets, not guarantees. Trading financial markets carries the risk of losing capital.',
        ),
      },
      {
        q: t('اطلاعات داخلی طرح‌ها برای من نمایش داده می‌شود؟', 'Will internal plan data be shown to me?'),
        a: t(
          'خیر. پیکربندی داخلی و مخزن مدیریتی فقط برای مدیران مجاز قابل دسترسی است و در رابط کاربری عادی نمایش داده نمی‌شود.',
          'No. Internal configuration and the management pool are accessible only to authorized administrators and are not exposed in the regular interface.',
        ),
      },
    ],
    cta: { href: '/dashboard/support', label: t('ثبت تیکت پشتیبانی', 'Open a support ticket') },
  },

  privacy: {
    eyebrow: t('قوانین', 'Legal'),
    title: t('سیاست حفظ حریم خصوصی', 'Privacy policy'),
    intro: t(
      'این صفحه خلاصه‌ای از نحوه نگهداری و استفاده از اطلاعات حساب شماست.',
      'This page summarizes how your account information is stored and used.',
    ),
    items: [
      {
        icon: 'shield',
        title: t('اطلاعات حساب', 'Account data'),
        body: t('نام، ایمیل و شماره تماس شما فقط برای ارائه سرویس و پشتیبانی استفاده می‌شود.', 'Your name, email and phone are used only to provide the service and support.'),
      },
      {
        icon: 'lock',
        title: t('رمز عبور', 'Passwords'),
        body: t('رمز عبور به‌صورت هش‌شده ذخیره می‌شود و هرگز به‌صورت متن ساده نگهداری نمی‌شود.', 'Passwords are stored as hashes and never kept in plain text.'),
      },
      {
        icon: 'chart',
        title: t('تراکنش‌ها', 'Transactions'),
        body: t('سوابق مالی برای حسابرسی و پیگیری درخواست‌ها نگهداری می‌شود.', 'Financial records are retained for audit and request tracking.'),
      },
    ],
  },

  terms: {
    eyebrow: t('قوانین', 'Legal'),
    title: t('قوانین و شرایط استفاده', 'Terms and conditions'),
    intro: t(
      'با استفاده از پلتفرم RENA TRADING COUPLE، شرایط زیر را می‌پذیرید.',
      'By using the RENA TRADING COUPLE platform you accept the following terms.',
    ),
    items: [
      {
        icon: 'check',
        title: t('حساب کاربری', 'Accounts'),
        body: t('مسئولیت حفظ رمز عبور و صحت اطلاعات حساب با کاربر است.', 'You are responsible for your password and the accuracy of your account information.'),
      },
      {
        icon: 'shield',
        title: t('دسترسی', 'Access'),
        body: t('دسترسی به بخش‌های مدیریتی فقط برای نقش مدیر مجاز و از طریق سرور کنترل می‌شود.', 'Administrative access is restricted to the admin role and enforced server-side.'),
      },
      {
        icon: 'chart',
        title: t('ریسک بازار', 'Market risk'),
        body: t('هیچ تضمین سود ارائه نمی‌شود؛ تصمیم معاملاتی نهایی با شماست.', 'No profit is guaranteed; final trading decisions remain yours.'),
      },
    ],
  },

  risk: {
    eyebrow: t('قوانین', 'Legal'),
    title: t('افشای ریسک', 'Risk disclosure'),
    intro: t(
      'معامله در بازارهای مالی، از جمله فارکس، فلزات و رمزارز، ریسک بالایی دارد.',
      'Trading financial markets — including forex, metals and crypto — carries substantial risk.',
    ),
    items: [
      {
        icon: 'chart',
        title: t('ریسک از دست دادن سرمایه', 'Risk of loss'),
        body: t('ممکن است بخشی یا تمام سرمایه خود را از دست بدهید. فقط سرمایه‌ای را به کار ببرید که توان از دست دادن آن را دارید.', 'You may lose some or all of your capital. Only commit capital you can afford to lose.'),
      },
      {
        icon: 'clock',
        title: t('بازدهی گذشته', 'Past performance'),
        body: t('عملکرد گذشته تضمینی برای نتایج آینده نیست.', 'Past performance does not guarantee future results.'),
      },
      {
        icon: 'support',
        title: t('مشاوره', 'Advice'),
        body: t('محتوای پلتفرم مشاوره مالی شخصی محسوب نمی‌شود.', 'Platform content does not constitute personal financial advice.'),
      },
    ],
  },
};
