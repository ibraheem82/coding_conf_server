import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';

dotenv.config();

/**
 * Environment variable schema with strict validation.
 * The application will not start if any required variable is missing.
 */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(9392),

    // Database
    DATABASE_URL: z.url('DATABASE_URL must be a valid URL'),

    // Cloudinary
    CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
    CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
    CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

    // Brevo (Email)
    BREVO_API_KEY: z.string().min(1, 'BREVO_API_KEY is required'),
    BREVO_SENDER_EMAIL: z.email('BREVO_SENDER_EMAIL must be a valid email'), // FIXED: Use z.email() directly
    BREVO_SENDER_NAME: z.string().default('Coding Conf'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables.
 * Throws descriptive error if validation fails.
 */
const parseEnv = (): Env => {
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        logger.fatal('❌ Invalid environment variables:');

        // Zod 4 approach: Use z.flattenError() to get field errors
        const flattened = z.flattenError(result.error);
        logger.fatal(flattened.fieldErrors);

        process.exit(1);
    }

    return result.data;
};

export const env = parseEnv();