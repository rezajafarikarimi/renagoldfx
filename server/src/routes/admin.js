import { Router } from 'express';
import { query, tx } from '../db.js';
import { requireAdmin, audit } from '../auth.js';
import { wrap, camel, camelAll, HttpError, toAmount, text } from '../util.js';

const router = Router();
router.use(requireAdmin);

const TABLES = {
  deposit: 'deposit_requests',
  withdrawal: 'withdrawal_requests',
  investment: 'investment_requests',
};

// Accept both the singular and plural resource names used by the client.
const normalizeKind = (value) =>
  ({ deposits: 'deposit', withdrawals: 'withdrawal', investments: 'investment' })[value] || value;

/* --------------------------------- overview -------------------------------- */

router.get(
  '/overview',
  wrap(async (req, res) => {
    const { rows } = await query(`
      select
        (select count(*)::int from users) as users,
        (select count(*)::int from users where status = 'ACTIVE') as active_users,
        (select count(*)::int from users where kyc_status = 'PENDING') as pending_kyc,
        (select count(*)::int from deposit_requests where status = 'PENDING') as pending_deposits,
        (select count(*)::int from withdrawal_requests where status = 'PENDING') as pending_withdrawals,
        (select count(*)::int from investment_requests where status = 'PENDING') as pending_investments,
        (select count(*)::int from support_tickets where status <> 'CLOSED') as open_tickets,
        (select coalesce(sum(amount), 0)::float8 from transactions where status = 'APPROVED') as volume,
        (select coalesce(sum(balance), 0)::float8 from wallets) as total_balance
    `);

    const [transactions, deposits, withdrawals, tickets, paidCommissions] = await Promise.all([
      query(
        `select t.id, t.kind, t.amount::float8 as amount, t.status, t.created_at, u.username
         from transactions t join users u on u.id = t.user_id
         order by t.created_at desc limit 8`,
      ),
      query(
        `select d.id, d.amount::float8 as amount, d.method, d.status, d.created_at, u.username
         from deposit_requests d join users u on u.id = d.user_id
         where d.status = 'PENDING' order by d.created_at desc limit 6`,
      ),
      query(
        `select w.id, w.amount::float8 as amount, w.destination, w.status, w.created_at, u.username
         from withdrawal_requests w join users u on u.id = w.user_id
         where w.status = 'PENDING' order by w.created_at desc limit 6`,
      ),
      query(
        `select s.id, s.subject, s.status, s.updated_at, u.username
         from support_tickets s join users u on u.id = s.user_id
         where s.status <> 'CLOSED' order by s.updated_at desc limit 6`,
      ),
      query('select coalesce(sum(amount), 0)::float8 as total from commissions where status = $1', ['APPROVED']),
    ]);

    res.json({
      stats: camel(rows[0]),
      recentTransactions: camelAll(transactions.rows),
      pendingDeposits: camelAll(deposits.rows),
      pendingWithdrawals: camelAll(withdrawals.rows),
      openTickets: camelAll(tickets.rows),
      commissionsPaid: paidCommissions.rows[0].total,
    });
  }),
);

/* ----------------------------------- users --------------------------------- */

router.get(
  '/users',
  wrap(async (req, res) => {
    const search = text(req.query.q, 80);
    const status = text(req.query.status, 20);
    const role = text(req.query.role, 20);
    const params = [`%${search}%`, status, role];
    const { rows } = await query(
      `select u.id, u.full_name, u.username, u.email, u.phone, u.role, u.status, u.kyc_status,
              u.created_at, u.last_login_at,
              coalesce(w.balance, 0)::float8 as balance, coalesce(w.available, 0)::float8 as available
       from users u left join wallets w on w.user_id = u.id
       where ($1 = '%%' or u.full_name ilike $1 or u.username ilike $1 or u.email ilike $1)
         and ($2 = '' or u.status = $2)
         and ($3 = '' or u.role = $3)
       order by u.created_at desc limit 200`,
      params,
    );
    res.json({ users: camelAll(rows) });
  }),
);

router.get(
  '/users/:id',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select u.id, u.full_name, u.username, u.email, u.phone, u.role, u.status, u.kyc_status,
              u.referral_code, u.created_at, u.last_login_at, u.referred_by,
              coalesce(w.balance, 0)::float8 as balance, coalesce(w.available, 0)::float8 as available
       from users u left join wallets w on w.user_id = u.id where u.id = $1`,
      [req.params.id],
    );
    if (!rows[0]) throw new HttpError(404, 'user_not_found');

    const [transactions, investments, deposits, withdrawals, tickets, referrer] = await Promise.all([
      query(
        `select id, kind, amount::float8 as amount, status, reference, created_at
         from transactions where user_id = $1 order by created_at desc limit 25`,
        [req.params.id],
      ),
      query(
        `select i.id, i.amount::float8 as amount, i.status, i.created_at, p.code as plan_code
         from investment_requests i left join plans p on p.id = i.plan_id
         where i.user_id = $1 order by i.created_at desc limit 10`,
        [req.params.id],
      ),
      query(
        `select id, amount::float8 as amount, method, status, created_at
         from deposit_requests where user_id = $1 order by created_at desc limit 10`,
        [req.params.id],
      ),
      query(
        `select id, amount::float8 as amount, destination, status, created_at
         from withdrawal_requests where user_id = $1 order by created_at desc limit 10`,
        [req.params.id],
      ),
      query(
        `select id, subject, status, created_at from support_tickets
         where user_id = $1 order by created_at desc limit 10`,
        [req.params.id],
      ),
      rows[0].referred_by
        ? query('select username, full_name from users where id = $1', [rows[0].referred_by])
        : Promise.resolve({ rows: [] }),
    ]);

    res.json({
      user: camel(rows[0]),
      referrer: referrer.rows[0] || null,
      transactions: camelAll(transactions.rows),
      investments: camelAll(investments.rows),
      deposits: camelAll(deposits.rows),
      withdrawals: camelAll(withdrawals.rows),
      tickets: camelAll(tickets.rows),
    });
  }),
);

router.patch(
  '/users/:id',
  wrap(async (req, res) => {
    const { id } = req.params;
    if (id === req.user.id && (req.body.role || req.body.status)) {
      throw new HttpError(400, 'cannot_modify_self');
    }
    const fields = [];
    const params = [id];

    if (req.body.status) {
      if (!['ACTIVE', 'SUSPENDED'].includes(req.body.status)) throw new HttpError(400, 'invalid_status');
      params.push(req.body.status);
      fields.push(`status = $${params.length}`);
    }
    if (req.body.role) {
      if (!['USER', 'ADMIN'].includes(req.body.role)) throw new HttpError(400, 'invalid_role');
      params.push(req.body.role);
      fields.push(`role = $${params.length}`);
    }
    if (req.body.kycStatus) {
      if (!['UNVERIFIED', 'PENDING', 'VERIFIED'].includes(req.body.kycStatus)) {
        throw new HttpError(400, 'invalid_kyc');
      }
      params.push(req.body.kycStatus);
      fields.push(`kyc_status = $${params.length}`);
    }
    if (!fields.length) throw new HttpError(400, 'nothing_to_update');

    const { rowCount } = await query(`update users set ${fields.join(', ')} where id = $1`, params);
    if (!rowCount) throw new HttpError(404, 'user_not_found');

    await audit(req.user.id, 'admin.user_updated', 'user', id, {
      status: req.body.status,
      role: req.body.role,
      kycStatus: req.body.kycStatus,
    });
    res.json({ ok: true });
  }),
);

/* ------------------------------- transactions ------------------------------ */

router.get(
  '/transactions',
  wrap(async (req, res) => {
    const status = text(req.query.status, 20);
    const kind = text(req.query.kind, 20);
    const search = text(req.query.q, 80);
    const { rows } = await query(
      `select t.id, t.kind, t.amount::float8 as amount, t.currency, t.status, t.reference,
              t.description, t.created_at, u.username, u.full_name
       from transactions t join users u on u.id = t.user_id
       where ($1 = '' or t.status = $1) and ($2 = '' or t.kind = $2)
         and ($3 = '%%' or u.username ilike $3 or coalesce(t.reference, '') ilike $3)
       order by t.created_at desc limit 200`,
      [status, kind, `%${search}%`],
    );
    res.json({ transactions: camelAll(rows) });
  }),
);

router.get(
  '/reports/transactions',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select t.id, u.username, u.email, t.kind, t.amount::float8 as amount, t.currency, t.status,
              t.reference, t.created_at
       from transactions t join users u on u.id = t.user_id order by t.created_at desc`,
    );
    const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      'id,username,email,kind,amount,currency,status,reference,created_at',
      ...rows.map((r) =>
        [r.id, r.username, r.email, r.kind, r.amount, r.currency, r.status, r.reference, r.created_at.toISOString()]
          .map(escape)
          .join(','),
      ),
    ].join('\n');
    await audit(req.user.id, 'admin.report_exported', 'transactions', null, { rows: rows.length });
    res.type('text/csv').set('Content-Disposition', 'attachment; filename="transactions.csv"').send(csv);
  }),
);

/* --------------------------------- requests -------------------------------- */

router.get(
  '/requests/:kind',
  wrap(async (req, res) => {
    const kind = normalizeKind(req.params.kind);
    const table = TABLES[kind];
    if (!table) throw new HttpError(404, 'not_found');
    const status = text(req.query.status, 20);
    const { rows } = await query(
      `select r.id, r.amount::float8 as amount, r.status, r.admin_note, r.created_at,
              r.reviewed_at, u.id as user_id, u.username, u.full_name,
              ${kind === 'deposit' ? 'r.method, r.tx_ref' : 'null as method, null as tx_ref'},
              ${kind === 'withdrawal' ? 'r.destination' : 'null as destination'},
              ${kind === 'investment' ? 'p.code as plan_code, p.name_fa as plan_name_fa' : 'null as plan_code, null as plan_name_fa'}
       from ${table} r
       join users u on u.id = r.user_id
       ${kind === 'investment' ? 'left join plans p on p.id = r.plan_id' : ''}
       where ($1 = '' or r.status = $1)
       order by r.created_at desc limit 200`,
      [status],
    );
    res.json({ requests: camelAll(rows) });
  }),
);

async function review(kind, id, action, note, actorId) {
  if (!TABLES[kind]) throw new HttpError(404, 'not_found');
  if (!['APPROVE', 'REJECT'].includes(action)) throw new HttpError(400, 'invalid_action');
  const approve = action === 'APPROVE';
  const table = TABLES[kind];

  await tx(async (client) => {
    const { rows } = await client.query(`select * from ${table} where id = $1 for update`, [id]);
    const request = rows[0];
    if (!request) throw new HttpError(404, 'request_not_found');
    if (request.status !== 'PENDING') throw new HttpError(409, 'already_reviewed');

    await client.query(
      `update ${table} set status = $2, reviewed_by = $3, reviewed_at = now(), admin_note = $4 where id = $1`,
      [id, approve ? 'APPROVED' : 'REJECTED', actorId, note || null],
    );

    if (request.transaction_id) {
      await client.query(
        'update transactions set status = $2, processed_at = now(), processed_by = $3 where id = $1',
        [request.transaction_id, approve ? 'APPROVED' : 'REJECTED', actorId],
      );
    }

    if (kind === 'deposit' && approve) {
      await client.query(
        `insert into wallets (user_id, balance, available) values ($1, $2, $2)
         on conflict (user_id) do update
         set balance = wallets.balance + excluded.balance,
             available = wallets.available + excluded.available,
             updated_at = now()`,
        [request.user_id, request.amount],
      );
    }

    if (kind === 'withdrawal') {
      if (approve) {
        const updated = await client.query(
          'update wallets set balance = balance - $2, updated_at = now() where user_id = $1 and balance >= $2',
          [request.user_id, request.amount],
        );
        if (!updated.rowCount) throw new HttpError(400, 'insufficient_balance');
      } else {
        await client.query(
          'update wallets set available = available + $2, updated_at = now() where user_id = $1',
          [request.user_id, request.amount],
        );
      }
    }

    if (kind === 'investment') {
      if (approve) {
        const updated = await client.query(
          'update wallets set balance = balance - $2, updated_at = now() where user_id = $1 and balance >= $2',
          [request.user_id, request.amount],
        );
        if (!updated.rowCount) throw new HttpError(400, 'insufficient_balance');
      } else {
        await client.query(
          'update wallets set available = available + $2, updated_at = now() where user_id = $1',
          [request.user_id, request.amount],
        );
      }
    }
  });

  await audit(actorId, `${kind}.${approve ? 'approved' : 'rejected'}`, kind, id, { note: note || null });
}

router.post(
  '/requests/:kind/:id/review',
  wrap(async (req, res) => {
    const note = text(req.body.note, 300);
    await review(
      normalizeKind(req.params.kind),
      req.params.id,
      text(req.body.action, 20).toUpperCase(),
      note,
      req.user.id,
    );
    res.json({ ok: true });
  }),
);

/* ---------------------------------- trading -------------------------------- */

router.get(
  '/trading',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select a.id, a.service, a.account_ref, a.notes, a.status, a.created_at, u.username, u.full_name
       from trading_activities a join users u on u.id = a.user_id
       order by a.created_at desc limit 200`,
    );
    res.json({ activities: camelAll(rows) });
  }),
);

router.post(
  '/trading/:id/review',
  wrap(async (req, res) => {
    const status = text(req.body.status, 20).toUpperCase();
    if (!['APPROVED', 'REJECTED'].includes(status)) throw new HttpError(400, 'invalid_status');
    const { rowCount } = await query(
      'update trading_activities set status = $2, reviewed_by = $3, reviewed_at = now() where id = $1',
      [req.params.id, status, req.user.id],
    );
    if (!rowCount) throw new HttpError(404, 'not_found');
    await audit(req.user.id, 'admin.trading_reviewed', 'trading', req.params.id, { status });
    res.json({ ok: true });
  }),
);

/* ----------------------------------- plans --------------------------------- */

function planPayload(body) {
  const code = text(body.code, 20).toUpperCase();
  if (!code) throw new HttpError(400, 'invalid_code');
  return {
    code,
    nameFa: text(body.nameFa, 120),
    nameEn: text(body.nameEn, 120),
    descriptionFa: text(body.descriptionFa, 600),
    descriptionEn: text(body.descriptionEn, 600),
    minAmount: toAmount(body.minAmount) ?? 0,
    maxAmount: body.maxAmount === '' || body.maxAmount === null || body.maxAmount === undefined
      ? null
      : toAmount(body.maxAmount),
    roiPercent: body.roiPercent === '' || body.roiPercent === null || body.roiPercent === undefined
      ? null
      : toAmount(body.roiPercent),
    durationDays: body.durationDays === '' || body.durationDays === null || body.durationDays === undefined
      ? null
      : Number(body.durationDays),
    // POOL1 is internal by design: it can never be published to ordinary users.
    isPublic: code === 'POOL1' ? false : Boolean(body.isPublic),
    allocationNotes: text(body.allocationNotes, 2000) || null,
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

router.get(
  '/plans',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select id, code, name_fa, name_en, description_fa, description_en,
              min_amount::float8 as min_amount, max_amount::float8 as max_amount,
              roi_percent::float8 as roi_percent, duration_days, is_public, allocation_notes, active, created_at
       from plans order by is_public desc, min_amount asc`,
    );
    res.json({ plans: camelAll(rows) });
  }),
);

router.post(
  '/plans',
  wrap(async (req, res) => {
    const plan = planPayload(req.body);
    const { rows } = await query(
      `insert into plans (code, name_fa, name_en, description_fa, description_en, min_amount, max_amount,
                          roi_percent, duration_days, is_public, allocation_notes, active)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       returning id`,
      [
        plan.code,
        plan.nameFa,
        plan.nameEn,
        plan.descriptionFa,
        plan.descriptionEn,
        plan.minAmount,
        plan.maxAmount,
        plan.roiPercent,
        plan.durationDays,
        plan.isPublic,
        plan.allocationNotes,
        plan.active,
      ],
    );
    await audit(req.user.id, 'admin.plan_created', 'plan', rows[0].id, { code: plan.code });
    res.status(201).json({ id: rows[0].id });
  }),
);

router.patch(
  '/plans/:id',
  wrap(async (req, res) => {
    const current = await query('select * from plans where id = $1', [req.params.id]);
    if (!current.rowCount) throw new HttpError(404, 'plan_not_found');
    const merged = planPayload({ ...camel(current.rows[0]), ...req.body });
    await query(
      `update plans set name_fa = $2, name_en = $3, description_fa = $4, description_en = $5,
                        min_amount = $6, max_amount = $7, roi_percent = $8, duration_days = $9,
                        is_public = $10, allocation_notes = $11, active = $12
       where id = $1`,
      [
        req.params.id,
        merged.nameFa,
        merged.nameEn,
        merged.descriptionFa,
        merged.descriptionEn,
        merged.minAmount,
        merged.maxAmount,
        merged.roiPercent,
        merged.durationDays,
        merged.isPublic,
        merged.allocationNotes,
        merged.active,
      ],
    );
    await audit(req.user.id, 'admin.plan_updated', 'plan', req.params.id, { isPublic: merged.isPublic });
    res.json({ ok: true });
  }),
);

/* ---------------------------------- support -------------------------------- */

router.get(
  '/support/tickets',
  wrap(async (req, res) => {
    const status = text(req.query.status, 20);
    const { rows } = await query(
      `select t.id, t.subject, t.category, t.priority, t.status, t.created_at, t.updated_at,
              u.username, u.full_name,
              (select count(*)::int from support_messages m where m.ticket_id = t.id) as message_count
       from support_tickets t join users u on u.id = t.user_id
       where ($1 = '' or t.status = $1)
       order by t.updated_at desc limit 200`,
      [status],
    );
    res.json({ tickets: camelAll(rows) });
  }),
);

router.get(
  '/support/tickets/:id',
  wrap(async (req, res) => {
    const ticket = await query(
      `select t.id, t.subject, t.category, t.priority, t.status, t.created_at, t.updated_at,
              u.id as user_id, u.username, u.full_name, u.email
       from support_tickets t join users u on u.id = t.user_id where t.id = $1`,
      [req.params.id],
    );
    if (!ticket.rowCount) throw new HttpError(404, 'ticket_not_found');
    const messages = await query(
      `select m.id, m.body, m.is_staff, m.created_at, u.full_name as author_name
       from support_messages m left join users u on u.id = m.author_id
       where m.ticket_id = $1 order by m.created_at asc`,
      [req.params.id],
    );
    res.json({ ticket: camel(ticket.rows[0]), messages: camelAll(messages.rows) });
  }),
);

router.post(
  '/support/tickets/:id/messages',
  wrap(async (req, res) => {
    const body = text(req.body.body, 4000);
    if (body.length < 2) throw new HttpError(400, 'invalid_message');
    const exists = await query('select id from support_tickets where id = $1', [req.params.id]);
    if (!exists.rowCount) throw new HttpError(404, 'ticket_not_found');

    await tx(async (client) => {
      await client.query(
        'insert into support_messages (ticket_id, author_id, is_staff, body) values ($1, $2, true, $3)',
        [req.params.id, req.user.id, body],
      );
      await client.query(
        "update support_tickets set status = 'ANSWERED', updated_at = now() where id = $1",
        [req.params.id],
      );
    });
    await audit(req.user.id, 'admin.ticket_replied', 'ticket', req.params.id);
    res.status(201).json({ ok: true });
  }),
);

router.patch(
  '/support/tickets/:id',
  wrap(async (req, res) => {
    const status = text(req.body.status, 20).toUpperCase();
    if (!['OPEN', 'ANSWERED', 'CLOSED'].includes(status)) throw new HttpError(400, 'invalid_status');
    const { rowCount } = await query(
      'update support_tickets set status = $2, updated_at = now() where id = $1',
      [req.params.id, status],
    );
    if (!rowCount) throw new HttpError(404, 'ticket_not_found');
    await audit(req.user.id, 'admin.ticket_status', 'ticket', req.params.id, { status });
    res.json({ ok: true });
  }),
);

/* --------------------------------- content --------------------------------- */

router.get(
  '/banners',
  wrap(async (req, res) => {
    const { rows } = await query('select * from banners order by sort asc');
    res.json({ banners: camelAll(rows) });
  }),
);

router.post(
  '/banners',
  wrap(async (req, res) => {
    const { rows } = await query(
      `insert into banners (title_fa, title_en, subtitle_fa, subtitle_en, cta_label, cta_href, sort, active)
       values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
      [
        text(req.body.titleFa, 160),
        text(req.body.titleEn, 160),
        text(req.body.subtitleFa, 300),
        text(req.body.subtitleEn, 300),
        text(req.body.ctaLabel, 60),
        text(req.body.ctaHref, 200),
        Number(req.body.sort) || 0,
        req.body.active === undefined ? true : Boolean(req.body.active),
      ],
    );
    await audit(req.user.id, 'admin.banner_created', 'banner', rows[0].id);
    res.status(201).json({ id: rows[0].id });
  }),
);

router.patch(
  '/banners/:id',
  wrap(async (req, res) => {
    const fields = [];
    const params = [req.params.id];
    const map = {
      titleFa: 'title_fa',
      titleEn: 'title_en',
      subtitleFa: 'subtitle_fa',
      subtitleEn: 'subtitle_en',
      ctaLabel: 'cta_label',
      ctaHref: 'cta_href',
    };
    for (const [key, column] of Object.entries(map)) {
      if (req.body[key] !== undefined) {
        params.push(text(req.body[key], 300));
        fields.push(`${column} = $${params.length}`);
      }
    }
    if (req.body.sort !== undefined) {
      params.push(Number(req.body.sort) || 0);
      fields.push(`sort = $${params.length}`);
    }
    if (req.body.active !== undefined) {
      params.push(Boolean(req.body.active));
      fields.push(`active = $${params.length}`);
    }
    if (!fields.length) throw new HttpError(400, 'nothing_to_update');

    const { rowCount } = await query(`update banners set ${fields.join(', ')} where id = $1`, params);
    if (!rowCount) throw new HttpError(404, 'not_found');
    await audit(req.user.id, 'admin.banner_updated', 'banner', req.params.id);
    res.json({ ok: true });
  }),
);

router.get(
  '/settings',
  wrap(async (req, res) => {
    const { rows } = await query('select key, value from site_settings');
    const settings = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json({ settings });
  }),
);

router.patch(
  '/settings',
  wrap(async (req, res) => {
    const allowed = ['announcement', 'service_cards', 'market_source', 'contact'];
    const key = text(req.body.key, 40);
    if (!allowed.includes(key)) throw new HttpError(400, 'invalid_key');
    if (key === 'market_source' && !['auto', 'demo'].includes(req.body.value)) {
      throw new HttpError(400, 'invalid_value');
    }
    await query(
      `insert into site_settings (key, value) values ($1, $2::jsonb)
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [key, JSON.stringify(req.body.value)],
    );
    await audit(req.user.id, 'admin.setting_updated', 'setting', key);
    res.json({ ok: true });
  }),
);

router.post(
  '/notifications',
  wrap(async (req, res) => {
    const title = text(req.body.title, 140);
    const body = text(req.body.body, 600);
    const userId = text(req.body.userId, 60);
    if (!title) throw new HttpError(400, 'invalid_title');

    if (userId) {
      await query('insert into notifications (user_id, title, body) values ($1, $2, $3)', [
        userId,
        title,
        body || null,
      ]);
    } else {
      await query(
        `insert into notifications (user_id, title, body)
         select id, $1, $2 from users where status = 'ACTIVE'`,
        [title, body || null],
      );
    }
    await audit(req.user.id, 'admin.notification_sent', 'notification', userId || 'broadcast');
    res.status(201).json({ ok: true });
  }),
);

/* ---------------------------------- audit ---------------------------------- */

router.get(
  '/audit',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select a.id, a.action, a.target_type, a.target_id, a.meta, a.created_at, u.username
       from audit_logs a left join users u on u.id = a.actor_id
       order by a.created_at desc limit 300`,
    );
    res.json({ logs: camelAll(rows) });
  }),
);

export default router;
