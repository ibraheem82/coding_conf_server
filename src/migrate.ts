import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, client } from './config/db.js';
import { logger } from './utils/logger.js';

async function runMigrations() {
    try {
        logger.info('⏳ Running database migrations...');

        // Run migrations reading from the 'drizzle' folder
        // In production, ensure the 'drizzle' folder is copied to the working directory
        await migrate(db, { migrationsFolder: './drizzle' });

        logger.info('✅ Database migrations completed successfully');

        // Close the connection used for migration
        await client.end();
        process.exit(0);
    } catch (error) {
        logger.error({ err: error }, '❌ Database migration failed');
        await client.end();
        process.exit(1);
    }
}

runMigrations();
