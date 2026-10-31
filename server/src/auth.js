import jwt from 'jsonwebtoken';
import { query } from './db.js';

const SECRET = process.env.JWT_SECRET || 'rena-local-development-secret';
export const COOKIE = 'rena_session';

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}

export function setSession(res, token, remember = true) {
  const options = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  };
  // "Remember me" keeps the session for 7 days; otherwise it is a session cookie.
  if (remember) options.maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie(COOKIE, token, options);
}

export function clearSession(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

export async function loadUser(req) {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    const { rows } = await query(
      `select id, full_name, username, email, phone, role, status, kyc_status,
              two_factor_enabled, referral_code, created_at, last_login_at
       from users where id = $1`,
      [payload.sub],
    );
    const user = rows[0];
    if (!user) return null;
    return {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      kycStatus: user.kyc_status,
      twoFactorEnabled: user.two_factor_enabled,
      referralCode: user.referral_code,
      createdAt: user.created_at,
      lastLoginAt: user.last_login_at,
    };
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'auth_required' });
  if (req.user.status !== 'ACTIVE') return res.status(403).json({ error: 'account_inactive' });
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'auth_required' });
  if (req.user.status !== 'ACTIVE') return res.status(403).json({ error: 'account_inactive' });
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'forbidden' });
  return next();
}

export async function audit(actorId, action, targetType = null, targetId = null, meta = null) {
  await query(
    'insert into audit_logs (actor_id, action, target_type, target_id, meta) values ($1, $2, $3, $4, $5)',
    [actorId, action, targetType, targetId, meta ? JSON.stringify(meta) : null],
  );
}
