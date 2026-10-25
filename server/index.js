import express from 'express';
import dotenv from 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import jobRoutes from './routes/jobs.js';
import uploadRoutes from './routes/upload.js';

// Load env
dotenv.config();

// Connect database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API running' });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NIYO IREME UNIT COMPANY LTD API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      content: '/api/content',
      jobs: '/api/jobs',
      upload: '/api/upload',
      health: '/api/health',
    },
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

