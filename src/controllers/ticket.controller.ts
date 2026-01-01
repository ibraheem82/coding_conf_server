import { type Request, type Response, type NextFunction } from 'express';
import { ticketService } from '../services/ticket.service.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Presentation Layer: Ticket Controller
 * Handles HTTP requests and delegates to the service layer.
 */
export const ticketController = {
    /**
     * POST /api/tickets
     * Create a new conference ticket.
     */
    async createTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, email, githubUsername } = req.body;

            // Multer adds the file to req.file
            if (!req.file) {
                throw new AppError('Avatar image is required', 400);
            }

            const ticket = await ticketService.createTicket(
                { fullName, email, githubUsername },
                req.file.buffer
            );

            res.status(201).json({
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                fullName: ticket.fullName,
                email: ticket.email,
                githubUsername: ticket.githubUsername,
                avatarUrl: ticket.avatarUrl,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/tickets/search
     * Search for a ticket by email or ticket number.
     */
    async searchTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { query } = req.query as { query: string };

            const ticket = await ticketService.searchTicket(query);

            if (!ticket) {
                throw new AppError('Ticket not found with the provided email or ticket number.', 404);
            }

            res.json({
                id: ticket.id,
                ticketNumber: ticket.ticketNumber,
                fullName: ticket.fullName,
                email: ticket.email,
                githubUsername: ticket.githubUsername,
                avatarUrl: ticket.avatarUrl,
            });
        } catch (error) {
            next(error);
        }
    },
};
