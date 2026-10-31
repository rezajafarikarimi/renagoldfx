import express from 'express';
import cookieParser from 'cookie-parser';
import { initDb } from './db.js';
import { seed } from './seed.js';
import { loadUser } from './auth.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import meRoutes from './routes/me.js';
import supportRoutes from './routes/support.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    req.user = await loadUser(req);
  } catch {
    req.user = null;
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/me', meRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'not_found' }));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('[api]', err);
  res.status(status).json({ error: err.code || 'server_error' });
});

const port = Number(process.env.PORT || 4000);

initDb()
  .then(seed)
  .then(() => {
    app.listen(port, '0.0.0.0', () => console.log(`RENA API listening on ${port}`));
  })
  .catch((err) => {
    console.error('Failed to start API', err);
    process.exit(1);
  });
