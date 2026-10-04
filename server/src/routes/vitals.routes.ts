import { Router } from 'express';
import { getVitalsHandler, logVitalHandler } from '../controllers/vitals.controller.js';

const router = Router();

router.get('/', getVitalsHandler);
router.post('/log', logVitalHandler);

export default router;
