import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * PostgreSQL connection using postgres.js driver.
 * Drizzle ORM wraps the connection for query building.
 */
export const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);

/**
 * Initialize database: create sequence if it doesn't exist.
 * This ensures ticket_sequence is available for ticket generation.
 */
async function initializeDatabase(): Promise<void> {
    try {
        // Create sequence if not exists (idempotent)
        await client`CREATE SEQUENCE IF NOT EXISTS ticket_sequence START WITH 1 INCREMENT BY 1`;
        logger.info('✅ Ticket sequence initialized');
    } catch (error) {
        logger.error({ err: error }, '❌ Failed to initialize ticket sequence');
    }
}

/**
 * Test database connection by running a simple query.
 * Logs success or failure.
 */
export async function testDatabaseConnection(): Promise<boolean> {
    try {
        await client`SELECT 1`;
        logger.info('✅ Database connected successfully');

        // Initialize sequence after confirming connection
        await initializeDatabase();

        return true;
    } catch (error) {
        logger.error({ err: error }, '❌ Database connection failed');
        return false;
    }
}

// Run connection test on startup
testDatabaseConnection();
