import { Request, Response, NextFunction } from 'express';
import { getPatientVitals, logNewVital } from '../services/vitals.service.js';

export async function getVitalsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = getPatientVitals();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function logVitalHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = logNewVital(req.body);
    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
