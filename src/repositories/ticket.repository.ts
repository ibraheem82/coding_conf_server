import { db } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { tickets, type NewTicket, type Ticket } from '../schemas/ticket.schema.js';
import { eq, or } from 'drizzle-orm';

/**
 * Data Access Layer for Ticket operations.
 * All database queries are isolated here.
 */
export const ticketRepository = {
    /**
     * Create a new ticket record.
     */
    async create(data: NewTicket): Promise<Ticket> {
        const [ticket] = await db.insert(tickets).values(data).returning();
        logger.info({ ticketId: ticket.id, email: ticket.email }, 'Ticket created');
        return ticket;
    },

    /**
     * Find a ticket by email address.
     */
    async findByEmail(email: string): Promise<Ticket | undefined> {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.email, email));
        return ticket;
    },

    /**
     * Find a ticket by ticket number.
     */
    async findByTicketNumber(ticketNumber: string): Promise<Ticket | undefined> {
        const [ticket] = await db.select().from(tickets).where(eq(tickets.ticketNumber, ticketNumber));
        return ticket;
    },

    /**
     * Search for a ticket by email OR ticket number.
     * Handles ticket numbers with or without # prefix.
     */
    async search(query: string): Promise<Ticket | undefined> {
        // Normalize the query:
        // - If it looks like an email, keep it as lowercase
        // - If it looks like a ticket number, ensure it has # prefix
        let normalizedQuery = query.trim();

        // Check if it's likely a ticket number (all digits, optionally with #)
        const isTicketNumber = /^#?\d+$/.test(normalizedQuery);

        if (isTicketNumber) {
            // Ensure # prefix for ticket number search
            normalizedQuery = normalizedQuery.startsWith('#') ? normalizedQuery : `#${normalizedQuery}`;
        } else {
            // Treat as email, normalize to lowercase
            normalizedQuery = normalizedQuery.toLowerCase();
        }

        const [ticket] = await db
            .select()
            .from(tickets)
            .where(
                or(
                    eq(tickets.email, normalizedQuery),
                    eq(tickets.ticketNumber, normalizedQuery)
                )
            );
        return ticket;
    },
};