import { Router } from 'express';
import {
  getTriageSessionsHandler,
  getTriageSessionByIdHandler,
  createTriageSessionHandler,
  sendMessageHandler,
  evaluateSessionHandler,
} from '../controllers/triage.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  CreateTriageSessionRequestSchema,
  SendTriageMessageRequestSchema,
} from '@healthpulse/shared';

const router = Router();

router.get('/sessions', getTriageSessionsHandler);
router.get('/sessions/:id', getTriageSessionByIdHandler);
router.get('/sessions/:sessionId', getTriageSessionByIdHandler);
router.post(
  '/sessions',
  validateBody(CreateTriageSessionRequestSchema),
  createTriageSessionHandler
);
router.post(
  '/sessions/:id/messages',
  validateBody(SendTriageMessageRequestSchema),
  sendMessageHandler
);
router.post(
  '/sessions/:sessionId/messages',
  validateBody(SendTriageMessageRequestSchema),
  sendMessageHandler
);
router.post('/sessions/:id/evaluate', evaluateSessionHandler);
router.post('/sessions/:sessionId/evaluate', evaluateSessionHandler);

export default router;
