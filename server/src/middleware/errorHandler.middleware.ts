import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class AppError extends Error {
  public statusCode: number;
  public safeUserMessage: string;
  public details?: unknown;

  constructor(message: string, statusCode = 500, safeUserMessage?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.safeUserMessage = safeUserMessage || 'A safe health guidance service error occurred. Please try again or consult a healthcare professional.';
    this.details = details;
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error('Unhandled error in request:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The submitted data did not match the required clinical format.',
        details: err.errors,
        safeUserMessage: 'Please review your input fields and ensure all required information is provided correctly.',
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: 'APP_ERROR',
        message: env.NODE_ENV === 'development' ? err.message : err.safeUserMessage,
        details: env.NODE_ENV === 'development' ? err.details : undefined,
        safeUserMessage: err.safeUserMessage,
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.NODE_ENV === 'development' ? err.message : 'Internal server error',
      safeUserMessage: 'An unexpected issue occurred while processing your health record. If you are experiencing an urgent medical event, please get emergency help immediately.',
    },
  });
}
