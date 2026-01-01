import { ticketRepository } from '../repositories/ticket.repository.js';
import { uploadToCloudinary } from './upload.service.js';
import { emailService } from './email.service.js';
import { generateTicketNumber } from '../utils/generateTicketNumber.js';
import type { CreateTicketInput } from '../schemas/validation.schema.js';
import type { Ticket } from '../schemas/ticket.schema.js';

/**
 * Business Logic Layer for Ticket operations.
 * Orchestrates repository calls, external services, and business rules.
 */
export const ticketService = {
    /**
     * Create a new ticket.
     * 1. Check if email already has a ticket (prevent duplicates).
     * 2. Upload avatar to Cloudinary.
     * 3. Generate unique ticket number.
     * 4. Save to database.
     * 5. Send confirmation email.
     */
    async createTicket(
        input: CreateTicketInput,
        avatarBuffer: Buffer
    ): Promise<Ticket> {
        // Check for existing ticket
        const existingTicket = await ticketRepository.findByEmail(input.email);
        if (existingTicket) {
            throw new Error('A ticket has already been generated for this email address.');
        }

        // Upload avatar to Cloudinary
        const avatarUrl = await uploadToCloudinary(avatarBuffer);

        // Generate unique ticket number using Postgres sequence
        // Sequence ensures atomicity and prevents collisions
        const ticketNumber = await generateTicketNumber();

        // Create ticket in database
        const ticket = await ticketRepository.create({
            fullName: input.fullName,
            email: input.email,
            githubUsername: input.githubUsername,
            avatarUrl,
            ticketNumber,
        });

        // Send confirmation email (non-blocking)
        emailService.sendTicketConfirmation(ticket.email, ticket.fullName, ticket.ticketNumber)
            .catch((err) => console.error('Failed to send confirmation email:', err));

        return ticket;
    },

    /**
     * Search for a ticket by email or ticket number.
     */
    async searchTicket(query: string): Promise<Ticket | null> {
        const ticket = await ticketRepository.search(query);
        return ticket || null;
    },
};
