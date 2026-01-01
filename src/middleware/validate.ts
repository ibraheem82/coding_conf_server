import { type Request, type Response, type NextFunction } from 'express';
import { type ZodType, ZodError, type ZodIssue } from 'zod';

/**
 * Express middleware factory for Zod validation.
 * Validates request body against the provided schema.
 */
export const validate = <T>(schema: ZodType<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues.map((e: ZodIssue) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};

/**
 * Validates query parameters against a Zod schema.
 */
export const validateQuery = <T>(schema: ZodType<T>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = await schema.parseAsync(req.query);
            Object.assign(req.query, parsed);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues.map((e: ZodIssue) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};
