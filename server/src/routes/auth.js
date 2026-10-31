import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken, setSession, clearSession, audit } from '../auth.js';
import { wrap, camel, HttpError, text } from '../util.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function publicUser(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status,
    kycStatus: row.kyc_status,
    referralCode: row.referral_code,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

router.post(
  '/register',
  wrap(async (req, res) => {
    const fullName = text(req.body.fullName, 120);
    const email = text(req.body.email, 160).toLowerCase();
    const username = text(req.body.username, 32).toLowerCase();
    const phone = text(req.body.phone, 32);
    const password = String(req.body.password || '');
    const confirm = String(req.body.confirmPassword || '');
    const referralCode = text(req.body.referralCode, 24).toUpperCase();

    if (fullName.length < 3) throw new HttpError(400, 'invalid_name');
    if (!EMAIL_RE.test(email)) throw new HttpError(400, 'invalid_email');
    if (!/^[a-z0-9_.]{3,24}$/.test(username)) throw new HttpError(400, 'invalid_username');
    if (password.length < 8) throw new HttpError(400, 'weak_password');
    if (password !== confirm) throw new HttpError(400, 'password_mismatch');
    if (!req.body.acceptTerms) throw new HttpError(400, 'terms_required');

    const dupe = await query('select 1 from users where email = $1 or username = $2', [email, username]);
    if (dupe.rowCount) throw new HttpError(409, 'already_exists');

    let referredBy = null;
    if (referralCode) {
      const ref = await query('select id from users where referral_code = $1', [referralCode]);
      referredBy = ref.rows[0]?.id || null;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const code = `${username.slice(0, 5).replace(/[^a-z0-9]/g, '').toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`;

    const { rows } = await query(
      `insert into users (full_name, username, email, phone, password_hash, referral_code, referred_by)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id, full_name, username, email, phone, role, status, kyc_status, referral_code, created_at, last_login_at`,
      [fullName, username, email, phone || null, passwordHash, code, referredBy],
    );
    const user = rows[0];
    await query('insert into wallets (user_id) values ($1)', [user.id]);
    await query(
      `insert into notifications (user_id, title, body)
       values ($1, 'به RENA خوش آمدید', 'حساب شما ایجاد شد. برای شروع معامله، کیف پول خود را شارژ کنید.')`,
      [user.id],
    );
    await audit(user.id, 'auth.register', 'user', user.id, { email });

    setSession(res, signToken(user));
    res.status(201).json({ user: publicUser(user) });
  }),
);

router.post(
  '/login',
  wrap(async (req, res) => {
    const identifier = text(req.body.identifier || req.body.email, 160).toLowerCase();
    const password = String(req.body.password || '');
    if (!identifier || !password) throw new HttpError(400, 'missing_credentials');

    const { rows } = await query(
      `select id, full_name, username, email, phone, role, status, kyc_status, referral_code,
              created_at, last_login_at, password_hash
       from users where lower(email) = $1 or lower(username) = $1`,
      [identifier],
    );
    const user = rows[0];
    if (!user) throw new HttpError(401, 'invalid_credentials');
    if (user.status !== 'ACTIVE') throw new HttpError(403, 'account_inactive');

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new HttpError(401, 'invalid_credentials');

    await query('update users set last_login_at = now() where id = $1', [user.id]);
    await audit(user.id, 'auth.login', 'user', user.id, { ip: req.ip });

    setSession(res, signToken(user), req.body.remember !== false);
    res.json({ user: publicUser(user) });
  }),
);

router.post(
  '/logout',
  wrap(async (req, res) => {
    if (req.user) await audit(req.user.id, 'auth.logout', 'user', req.user.id);
    clearSession(res);
    res.json({ ok: true });
  }),
);

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'auth_required' });
  res.json({ user: req.user });
});

router.post(
  '/forgot',
  wrap(async (req, res) => {
    const email = text(req.body.email, 160).toLowerCase();
    if (!email) throw new HttpError(400, 'invalid_email');
    const { rows } = await query('select id from users where lower(email) = $1', [email]);
    if (rows[0]) {
      await audit(rows[0].id, 'auth.password_reset_requested', 'user', rows[0].id);
    }
    res.json({ ok: true, channel: 'support' });
  }),
);

export default router;
