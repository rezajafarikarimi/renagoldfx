import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query, tx } from '../db.js';
import { requireAuth, audit } from '../auth.js';
import { wrap, camel, camelAll, HttpError, toAmount, text } from '../util.js';

const router = Router();
router.use(requireAuth);

async function ensureWallet(userId) {
  await query('insert into wallets (user_id) values ($1) on conflict (user_id) do nothing', [userId]);
}

async function walletOf(userId) {
  await ensureWallet(userId);
  const { rows } = await query(
    'select balance::float8 as balance, available::float8 as available, currency from wallets where user_id = $1',
    [userId],
  );
  return rows[0];
}

router.get(
  '/overview',
  wrap(async (req, res) => {
    const uid = req.user.id;
    const wallet = await walletOf(uid);
    const [transactions, deposits, withdrawals, investments, tickets, notifications] = await Promise.all([
      query(
        `select id, kind, amount::float8 as amount, status, reference, description, created_at
         from transactions where user_id = $1 order by created_at desc limit 6`,
        [uid],
      ),
      query("select count(*)::int as count from deposit_requests where user_id = $1 and status = 'PENDING'", [uid]),
      query("select count(*)::int as count from withdrawal_requests where user_id = $1 and status = 'PENDING'", [uid]),
      query("select count(*)::int as count from investment_requests where user_id = $1 and status = 'PENDING'", [uid]),
      query("select count(*)::int as count from support_tickets where user_id = $1 and status <> 'CLOSED'", [uid]),
      query(
        'select id, title, body, read, created_at from notifications where user_id = $1 order by created_at desc limit 6',
        [uid],
      ),
    ]);

    res.json({
      profile: req.user,
      wallet,
      counts: {
        pendingDeposits: deposits.rows[0].count,
        pendingWithdrawals: withdrawals.rows[0].count,
        pendingInvestments: investments.rows[0].count,
        openTickets: tickets.rows[0].count,
      },
      recentTransactions: camelAll(transactions.rows),
      notifications: camelAll(notifications.rows),
    });
  }),
);

router.get(
  '/wallet',
  wrap(async (req, res) => {
    const uid = req.user.id;
    const wallet = await walletOf(uid);
    const [transactions, deposits, withdrawals] = await Promise.all([
      query(
        `select id, kind, amount::float8 as amount, status, reference, description, created_at
         from transactions where user_id = $1 order by created_at desc limit 100`,
        [uid],
      ),
      query(
        `select id, amount::float8 as amount, method, tx_ref, status, admin_note, created_at
         from deposit_requests where user_id = $1 order by created_at desc limit 50`,
        [uid],
      ),
      query(
        `select id, amount::float8 as amount, destination, status, admin_note, created_at
         from withdrawal_requests where user_id = $1 order by created_at desc limit 50`,
        [uid],
      ),
    ]);
    res.json({
      wallet,
      transactions: camelAll(transactions.rows),
      deposits: camelAll(deposits.rows),
      withdrawals: camelAll(withdrawals.rows),
    });
  }),
);

router.get(
  '/transactions',
  wrap(async (req, res) => {
    const params = [req.user.id];
    let sql = `select id, kind, amount::float8 as amount, status, reference, description, created_at
               from transactions where user_id = $1`;
    const type = text(req.query.type, 20);
    const status = text(req.query.status, 20);
    const search = text(req.query.q, 80);

    if (type) {
      params.push(type);
      sql += ` and kind = $${params.length}`;
    }
    if (status) {
      params.push(status);
      sql += ` and status = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      sql += ` and (coalesce(reference, '') ilike $${params.length} or coalesce(description, '') ilike $${params.length})`;
    }
    sql += ' order by created_at desc limit 200';
    const { rows } = await query(sql, params);
    res.json({ transactions: camelAll(rows) });
  }),
);

router.get(
  '/plans',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select id, code, name_fa, name_en, description_fa, description_en,
              min_amount::float8 as min_amount, max_amount::float8 as max_amount,
              roi_percent::float8 as roi_percent, duration_days
       from plans where active = true and is_public = true and code <> 'POOL1'
       order by min_amount asc`,
    );
    res.json({ plans: camelAll(rows) });
  }),
);

/* -------------------------------- deposits -------------------------------- */

router.post(
  '/deposits',
  wrap(async (req, res) => {
    const amount = toAmount(req.body.amount);
    const method = text(req.body.method, 40) || 'USDT';
    const reference = text(req.body.txRef, 120);
    if (!amount || amount <= 0) throw new HttpError(400, 'invalid_amount');
    if (amount > 1_000_000) throw new HttpError(400, 'amount_too_large');

    await ensureWallet(req.user.id);
    await tx(async (client) => {
      const created = await client.query(
        `insert into transactions (user_id, kind, amount, status, reference, description)
         values ($1, 'DEPOSIT', $2, 'PENDING', $3, 'Deposit request') returning id`,
        [req.user.id, amount, reference || null],
      );
      await client.query(
        `insert into deposit_requests (user_id, amount, method, tx_ref, transaction_id)
         values ($1, $2, $3, $4, $5)`,
        [req.user.id, amount, method, reference || null, created.rows[0].id],
      );
    });
    await audit(req.user.id, 'deposit.requested', 'deposit', null, { amount });
    res.status(201).json({ ok: true });
  }),
);

router.get(
  '/deposits',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select id, amount::float8 as amount, method, tx_ref, status, admin_note, created_at
       from deposit_requests where user_id = $1 order by created_at desc limit 100`,
      [req.user.id],
    );
    res.json({ deposits: camelAll(rows) });
  }),
);

/* ------------------------------- withdrawals ------------------------------ */

router.post(
  '/withdrawals',
  wrap(async (req, res) => {
    const amount = toAmount(req.body.amount);
    const destination = text(req.body.destination, 160);
    if (!amount || amount <= 0) throw new HttpError(400, 'invalid_amount');
    if (destination.length < 6) throw new HttpError(400, 'invalid_destination');

    await ensureWallet(req.user.id);
    await tx(async (client) => {
      const wallet = await client.query(
        'select available::float8 as available from wallets where user_id = $1 for update',
        [req.user.id],
      );
      if (!wallet.rowCount || wallet.rows[0].available < amount) {
        throw new HttpError(400, 'insufficient_funds');
      }
      await client.query(
        'update wallets set available = available - $2, updated_at = now() where user_id = $1',
        [req.user.id, amount],
      );
      const created = await client.query(
        `insert into transactions (user_id, kind, amount, status, reference, description)
         values ($1, 'WITHDRAWAL', $2, 'PENDING', $3, 'Withdrawal request') returning id`,
        [req.user.id, amount, destination],
      );
      await client.query(
        `insert into withdrawal_requests (user_id, amount, destination, transaction_id)
         values ($1, $2, $3, $4)`,
        [req.user.id, amount, destination, created.rows[0].id],
      );
    });
    await audit(req.user.id, 'withdrawal.requested', 'withdrawal', null, { amount });
    res.status(201).json({ ok: true });
  }),
);

router.get(
  '/withdrawals',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select id, amount::float8 as amount, destination, status, admin_note, created_at
       from withdrawal_requests where user_id = $1 order by created_at desc limit 100`,
      [req.user.id],
    );
    res.json({ withdrawals: camelAll(rows) });
  }),
);

/* ------------------------------- investments ------------------------------ */

router.get(
  '/investments',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select i.id, i.amount::float8 as amount, i.notes, i.status, i.admin_note, i.created_at,
              p.code as plan_code, p.name_fa as plan_name_fa, p.name_en as plan_name_en
       from investment_requests i left join plans p on p.id = i.plan_id
       where i.user_id = $1 order by i.created_at desc limit 100`,
      [req.user.id],
    );
    res.json({ investments: camelAll(rows) });
  }),
);

router.post(
  '/investments',
  wrap(async (req, res) => {
    const planId = text(req.body.planId, 60);
    const amount = toAmount(req.body.amount);
    const notes = text(req.body.notes, 300);
    if (!planId) throw new HttpError(400, 'invalid_plan');
    if (!amount || amount <= 0) throw new HttpError(400, 'invalid_amount');

    const plan = await query(
      'select id, min_amount::float8 as min_amount, max_amount::float8 as max_amount from plans where id = $1 and active = true and is_public = true',
      [planId],
    );
    if (!plan.rowCount) throw new HttpError(400, 'invalid_plan');
    const { min_amount: min, max_amount: max } = plan.rows[0];
    if (amount < min) throw new HttpError(400, 'below_minimum');
    if (max !== null && amount > max) throw new HttpError(400, 'above_maximum');

    await ensureWallet(req.user.id);
    await tx(async (client) => {
      const wallet = await client.query(
        'select available::float8 as available from wallets where user_id = $1 for update',
        [req.user.id],
      );
      if (!wallet.rowCount || wallet.rows[0].available < amount) {
        throw new HttpError(400, 'insufficient_funds');
      }
      await client.query(
        'update wallets set available = available - $2, updated_at = now() where user_id = $1',
        [req.user.id, amount],
      );
      const created = await client.query(
        `insert into transactions (user_id, kind, amount, status, description)
         values ($1, 'INVESTMENT', $2, 'PENDING', 'Investment request') returning id`,
        [req.user.id, amount],
      );
      await client.query(
        `insert into investment_requests (user_id, plan_id, amount, notes, transaction_id)
         values ($1, $2, $3, $4, $5)`,
        [req.user.id, planId, amount, notes || null, created.rows[0].id],
      );
    });
    await audit(req.user.id, 'investment.requested', 'investment', null, { amount, planId });
    res.status(201).json({ ok: true });
  }),
);

/* --------------------------------- trading -------------------------------- */

router.get(
  '/trading',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select id, service, account_ref, notes, status, created_at
       from trading_activities where user_id = $1 order by created_at desc limit 100`,
      [req.user.id],
    );
    res.json({ activities: camelAll(rows) });
  }),
);

router.post(
  '/trading',
  wrap(async (req, res) => {
    const service = text(req.body.service, 10).toUpperCase();
    const accountRef = text(req.body.accountRef, 120);
    const notes = text(req.body.notes, 300);
    if (!['PROP', 'COPY'].includes(service)) throw new HttpError(400, 'invalid_service');
    if (!accountRef) throw new HttpError(400, 'invalid_account');

    await query(
      'insert into trading_activities (user_id, service, account_ref, notes) values ($1, $2, $3, $4)',
      [req.user.id, service, accountRef, notes || null],
    );
    await audit(req.user.id, 'trading.submitted', 'trading', null, { service });
    res.status(201).json({ ok: true });
  }),
);

/* -------------------------------- referrals ------------------------------- */

router.get(
  '/referrals',
  wrap(async (req, res) => {
    const [users, commissions] = await Promise.all([
      query(
        `select id, full_name, username, status, kyc_status, created_at
         from users where referred_by = $1 order by created_at desc limit 100`,
        [req.user.id],
      ),
      query(
        `select amount::float8 as amount, rate::float8 as rate, status, created_at
         from commissions where user_id = $1 order by created_at desc limit 100`,
        [req.user.id],
      ),
    ]);
    const total = commissions.rows
      .filter((row) => row.status === 'APPROVED')
      .reduce((sum, row) => sum + row.amount, 0);

    res.json({
      code: req.user.referralCode,
      users: camelAll(users.rows),
      commissions: camelAll(commissions.rows),
      totals: { users: users.rowCount, commission: Math.round(total * 100) / 100 },
    });
  }),
);

/* --------------------------------- profile -------------------------------- */

router.patch(
  '/profile',
  wrap(async (req, res) => {
    const fullName = text(req.body.fullName, 120);
    const phone = text(req.body.phone, 32);
    const email = text(req.body.email, 160).toLowerCase();
    if (fullName.length < 3) throw new HttpError(400, 'invalid_name');
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) throw new HttpError(400, 'invalid_email');

    const dupe = await query('select 1 from users where lower(email) = $1 and id <> $2', [email, req.user.id]);
    if (dupe.rowCount) throw new HttpError(409, 'email_in_use');

    await query('update users set full_name = $2, phone = $3, email = $4 where id = $1', [
      req.user.id,
      fullName,
      phone || null,
      email,
    ]);
    await audit(req.user.id, 'profile.updated', 'user', req.user.id);
    res.json({ ok: true });
  }),
);

router.post(
  '/password',
  wrap(async (req, res) => {
    const current = String(req.body.currentPassword || '');
    const next = String(req.body.newPassword || '');
    if (next.length < 8) throw new HttpError(400, 'weak_password');

    const { rows } = await query('select password_hash from users where id = $1', [req.user.id]);
    const ok = await bcrypt.compare(current, rows[0].password_hash);
    if (!ok) throw new HttpError(400, 'invalid_password');

    await query('update users set password_hash = $2 where id = $1', [
      req.user.id,
      await bcrypt.hash(next, 10),
    ]);
    await audit(req.user.id, 'security.password_changed', 'user', req.user.id);
    res.json({ ok: true });
  }),
);

router.get(
  '/security',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select action, created_at, meta from audit_logs
       where actor_id = $1 and action in ('auth.login', 'auth.register', 'auth.logout', 'security.password_changed')
       order by created_at desc limit 25`,
      [req.user.id],
    );
    res.json({
      twoFactorEnabled: req.user.twoFactorEnabled,
      lastLoginAt: req.user.lastLoginAt,
      session: {
        userAgent: req.get('user-agent') || '',
        ip: req.ip,
        startedAt: req.user.lastLoginAt || req.user.createdAt,
      },
      history: camelAll(rows),
    });
  }),
);

/* ------------------------------ notifications ----------------------------- */

router.get(
  '/notifications',
  wrap(async (req, res) => {
    const { rows } = await query(
      'select id, title, body, read, created_at from notifications where user_id = $1 order by created_at desc limit 50',
      [req.user.id],
    );
    res.json({ notifications: camelAll(rows) });
  }),
);

router.post(
  '/notifications/:id/read',
  wrap(async (req, res) => {
    await query('update notifications set read = true where id = $1 and user_id = $2', [
      req.params.id,
      req.user.id,
    ]);
    res.json({ ok: true });
  }),
);

router.post(
  '/notifications/read-all',
  wrap(async (req, res) => {
    await query('update notifications set read = true where user_id = $1', [req.user.id]);
    res.json({ ok: true });
  }),
);

export default router;
