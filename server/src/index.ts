import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import apiRouter from './routes/api.routes.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & cross-origin setup
const configuredOrigins = env.CLIENT_URL
  ? env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : ['http://localhost:5173'];

const allowedOrigins =
  env.NODE_ENV === 'production'
    ? configuredOrigins
    : Array.from(new Set([...configuredOrigins, 'http://localhost:5173', 'http://127.0.0.1:5173']));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as health checks, curl, or server-to-server)
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by HealthPulse CORS policy.`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving for document previewing
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Mount API routes
app.use('/api', apiRouter);

// Fallback 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested HealthPulse resource was not found.',
      safeUserMessage: 'The requested health record or service could not be located.',
    },
  });
});

// Centralized error handler
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`===============================================`);
  console.log(`🏥 HealthPulse API Server running on port ${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   API Endpoint: http://localhost:${env.PORT}/api`);
  console.log(`===============================================`);
});

export { app, server };
