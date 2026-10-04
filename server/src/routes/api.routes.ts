import { Router } from 'express';
import vitalsRoutes from './vitals.routes.js';
import documentsRoutes from './documents.routes.js';
import triageRoutes from './triage.routes.js';

const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'HealthPulse API Service',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.use('/vitals', vitalsRoutes);
apiRouter.use('/documents', documentsRoutes);
apiRouter.use('/triage', triageRoutes);

export default apiRouter;
