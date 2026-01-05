import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { ticketRouter } from './routes/ticket.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { requestLogger } from './middleware/logger.middleware.js';

const app = express();

// CORS Middleware
app.use(cors({
    // UPDATE: Allow your cloud domain. For now, '*' allows everything (good for testing)
    origin: '*', 
    credentials: true,
}));

// Logger Middleware
app.use(requestLogger);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- NEW: Root Health Check (Crucial for Cloud Load Balancers) ---
app.get('/', (_req: Request, res: Response) => {
    res.send('API is running...');
});

// Existing Health Check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/tickets', ticketRouter);

// Global Error Handler (must be last)
app.use(errorHandler);
const PORT = Number(process.env.PORT) || env.PORT || 9392;

// --- FIXED: Start Server with '0.0.0.0' ---
app.listen(PORT, '0.0.0.0', () => {
    // I updated the log text so it doesn't lie to you anymore :)
    logger.info(`🚀 Server running on http://0.0.0.0:${env.PORT}`);
    logger.info(`📍 Environment: ${env.NODE_ENV}`);
    logger.info(`📧 Brevo API Key: ${env.BREVO_API_KEY ? 'Present' : 'MISSING'}`);
});

export default app;