import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Custom logging middleware to replace pino-http.
 * Avoids conflicts with Express 5 request object properties.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Log request start
    logger.info({
        method: req.method,
        url: req.url,
        ip: req.ip,
    }, 'Incoming Request');

    // Hook into response finish to log duration and status
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
        }, 'Request Completed');
    });

    next();
};
