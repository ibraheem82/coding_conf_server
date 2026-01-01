import { type Request, type Response, type NextFunction } from 'express';

/**
 * Custom application error with status code.
 */
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'AppError';
    }
}

/**
 * Global error handler middleware for Express 5.
 * Express 5 automatically catches errors from async route handlers.
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('❌ Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error('Stack:', err.stack);
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
        return;
    }

    // Handle known error types
    if (err.message.includes('already been generated')) {
        res.status(409).json({ message: err.message });
        return;
    }

    // Handle database unique constraint violations
    if (err.message.includes('unique constraint') || err.message.includes('duplicate key')) {
        res.status(409).json({
            message: 'A ticket with this email already exists. Please use the retrieve option to find your ticket.'
        });
        return;
    }

    // Handle database column length errors
    if (err.message.includes('value too long') || err.message.includes('Failed query')) {
        res.status(400).json({
            message: 'There was an issue saving your ticket. Please try again or contact support.'
        });
        return;
    }

    // Handle Cloudinary errors
    if (err.message.includes('cloudinary') || err.message.includes('upload')) {
        res.status(500).json({
            message: 'Failed to upload your avatar. Please try a smaller image.'
        });
        return;
    }

    // Default to 500 for unknown errors
    res.status(500).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong. Please try again later.'
            : err.message,
    });
};
