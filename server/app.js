import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import jobRoutes from './routes/jobs.js';
import uploadRoutes from './routes/upload.js';
import serviceRoutes from './routes/services.js';
import blogRoutes from './routes/blog.js';
import settingsRoutes from './routes/settings.js';

const app = express();
const serverDir = path.dirname(fileURLToPath(import.meta.url));
app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({
  origin(origin, callback) {
    const allowed = (process.env.CORS_ORIGIN || 'https://niyoiremeunitltd.vercel.app,http://localhost:3000,http://localhost:5173')
      .split(',').map((value) => value.trim()).filter(Boolean);
    if (!origin || allowed.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
}));
const authRequestWindows = new Map();
const limitAuthAttempts = (max) => (req, res, next) => {
  if (authRequestWindows.size > 10000) {
    for (const [entry, state] of authRequestWindows) if (state.resetAt <= Date.now()) authRequestWindows.delete(entry);
  }
  const now = Date.now();
  const key = `${req.baseUrl}${req.path}:${req.ip}`;
  const state = authRequestWindows.get(key);
  if (!state || state.resetAt <= now) authRequestWindows.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
  else if (state.count >= max) return res.status(429).json({ success: false, message: 'Too many attempts. Please try again in a few minutes.' });
  else state.count += 1;
  next();
};
app.use('/api/auth/login', limitAuthAttempts(10));
app.use('/api/auth/register', limitAuthAttempts(5));
app.use('/uploads', express.static(path.join(serverDir, 'uploads'), { dotfiles: 'deny', index: false, maxAge: '1d' }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (_req, res) => res.status(200).json({ success: true, message: 'API running' }));
app.get('/', (_req, res) => res.status(200).json({
  success: true,
  message: 'NIYO IREME UNIT LTD API',
  version: '1.0.0',
  endpoints: { auth: '/api/auth', content: '/api/content', jobs: '/api/jobs', services: '/api/services', blog: '/api/blog', settings: '/api/settings', upload: '/api/upload', health: '/api/health' },
}));

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.statusCode || (res.statusCode >= 400 ? res.statusCode : null) || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : err.code === 11000 ? 409 : 500);
  const message = status >= 500 && process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Server error');
  res.status(status).json({ success: false, message });
});
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

export default app;
