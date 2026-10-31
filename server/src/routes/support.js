import { Router } from 'express';
import { query, tx } from '../db.js';
import { requireAuth } from '../auth.js';
import { wrap, camel, camelAll, HttpError, text } from '../util.js';

const router = Router();
router.use(requireAuth);

async function ownTicket(ticketId, userId) {
  const { rows } = await query(
    'select id, subject, category, priority, status, created_at, updated_at from support_tickets where id = $1 and user_id = $2',
    [ticketId, userId],
  );
  if (!rows[0]) throw new HttpError(404, 'ticket_not_found');
  return rows[0];
}

router.get(
  '/tickets',
  wrap(async (req, res) => {
    const { rows } = await query(
      `select t.id, t.subject, t.category, t.priority, t.status, t.created_at, t.updated_at,
              (select count(*)::int from support_messages m where m.ticket_id = t.id) as message_count
       from support_tickets t where t.user_id = $1 order by t.updated_at desc limit 100`,
      [req.user.id],
    );
    res.json({ tickets: camelAll(rows) });
  }),
);

router.post(
  '/tickets',
  wrap(async (req, res) => {
    const subject = text(req.body.subject, 140);
    const category = text(req.body.category, 30) || 'GENERAL';
    const body = text(req.body.message, 4000);
    if (subject.length < 4) throw new HttpError(400, 'invalid_subject');
    if (body.length < 5) throw new HttpError(400, 'invalid_message');

    const ticket = await tx(async (client) => {
      const created = await client.query(
        'insert into support_tickets (user_id, subject, category) values ($1, $2, $3) returning id',
        [req.user.id, subject, category],
      );
      await client.query(
        'insert into support_messages (ticket_id, author_id, is_staff, body) values ($1, $2, false, $3)',
        [created.rows[0].id, req.user.id, body],
      );
      return created.rows[0].id;
    });

    res.status(201).json({ id: ticket });
  }),
);

router.get(
  '/tickets/:id',
  wrap(async (req, res) => {
    const ticket = await ownTicket(req.params.id, req.user.id);
    const { rows } = await query(
      `select m.id, m.body, m.is_staff, m.created_at, u.full_name as author_name
       from support_messages m left join users u on u.id = m.author_id
       where m.ticket_id = $1 order by m.created_at asc`,
      [ticket.id],
    );
    res.json({
      ticket: camel(ticket),
      messages: camelAll(rows),
    });
  }),
);

router.post(
  '/tickets/:id/messages',
  wrap(async (req, res) => {
    const body = text(req.body.body, 4000);
    if (body.length < 2) throw new HttpError(400, 'invalid_message');
    const ticket = await ownTicket(req.params.id, req.user.id);
    if (ticket.status === 'CLOSED') throw new HttpError(409, 'ticket_closed');

    await tx(async (client) => {
      await client.query(
        'insert into support_messages (ticket_id, author_id, is_staff, body) values ($1, $2, false, $3)',
        [ticket.id, req.user.id, body],
      );
      await client.query(
        "update support_tickets set status = 'OPEN', updated_at = now() where id = $1",
        [ticket.id],
      );
    });
    res.status(201).json({ ok: true });
  }),
);

export default router;
