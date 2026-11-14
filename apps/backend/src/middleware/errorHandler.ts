import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../config/logger.js';
import { config } from '../config/environment.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] | undefined = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === 'ValidationError') {
    // Mongoose Validation Error
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors || {}).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.code === 11000) {
    // MongoDB Duplicate Key Error
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    
    if (field === 'utrNumber') {
      message = `This UPI Transaction Reference (UTR) '${value}' has already been submitted for another order. Replay is strictly prohibited.`;
    } else if (field === 'email') {
      message = 'An account with this email address already exists.';
    } else if (field === 'sku') {
      message = `A product with SKU '${value}' already exists.`;
    } else {
      message = `Duplicate value for ${field}.`;
    }
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token is invalid or expired.';
  } else {
    logger.error(`[Unhandled Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
}
