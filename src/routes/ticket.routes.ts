import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { createTicketSchema, searchTicketSchema } from '../schemas/validation.schema.js';
import { upload } from '../middleware/upload.js';

export const ticketRouter = Router();

/**
 * POST /api/tickets
 * Create a new ticket with avatar upload.
 */
ticketRouter.post(
    '/',
    upload.single('avatar'),
    validate(createTicketSchema),
    ticketController.createTicket
);

/**
 * GET /api/tickets/search?query=...
 * Search for a ticket by email or ticket number.
 */
ticketRouter.get(
    '/search',
    validateQuery(searchTicketSchema),
    ticketController.searchTicket
);
