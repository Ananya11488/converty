import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

/**
 * Global error handling middleware
 * Catches all errors and returns appropriate responses
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default error
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message || "Internal Server Error";

  // Log error for monitoring
  console.error(`[${new Date().toISOString()}] Error:`, {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Send error response
  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

/**
 * Async error wrapper - catches async errors and passes them to error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
}

