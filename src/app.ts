import express, { type Request, type Response } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { ticketRouter } from './routes/ticket.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { requestLogger } from './middleware/logger.middleware.js';

const app = express();

// CORS Middleware - Allow frontend origins
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

// Logger Middleware
app.use(requestLogger);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/tickets', ticketRouter);

// Global Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📍 Environment: ${env.NODE_ENV}`);
    logger.info(`📧 Brevo API Key: ${env.BREVO_API_KEY ? 'Present (Starts with ' + env.BREVO_API_KEY.substring(0, 4) + ')' : 'MISSING'}`);
});

export default app;
