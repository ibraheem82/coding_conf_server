import { z } from 'zod';

/**
 * Validation schema for creating a new ticket.
 * Used in the POST /api/tickets endpoint.
 */
export const createTicketSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(255, 'Full name must not exceed 255 characters')
        .trim(),
    email: z
        .email('Invalid email address')
        .max(255, 'Email must not exceed 255 characters')
        .toLowerCase()
        .trim(),
    githubUsername: z
        .string()
        .min(1, 'GitHub username is required')
        .max(255, 'GitHub username must not exceed 255 characters')
        .trim(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

/**
 * Validation schema for searching tickets.
 * Accepts email OR ticket number.
 */
export const searchTicketSchema = z.object({
    query: z
        .string()
        .min(1, 'Search query is required')
        .trim(),
});

export type SearchTicketInput = z.infer<typeof searchTicketSchema>;
