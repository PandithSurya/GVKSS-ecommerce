import { Response } from 'express';

export interface ApiResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export function sendResponse<T>(
  res: Response,
  { statusCode = 200, message = 'Success', data, meta }: ApiResponseOptions<T>
): void {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
}
