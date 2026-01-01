import { client } from '../config/db.js';

/**
 * Generate a unique, sequential ticket number using Postgres sequence.
 * Uses `nextval('ticket_sequence')` and formats to 5-digit zero-padded string.
 *
 * Examples: #00001, #00124, #99999
 *
 * @returns Promise<string> - Formatted ticket number (e.g., "#00001")
 */
export async function generateTicketNumber(): Promise<string> {
    // Atomic operation: Get next value from Postgres sequence
    // This ensures uniqueness even under concurrent requests
    const result = await client`SELECT nextval('ticket_sequence') as ticket_id`;

    // Extract the numeric ID from the result
    // postgres.js returns an array of rows
    const ticketId = Number(result[0].ticket_id);

    // Format to 5-digit zero-padded string with # prefix
    const formattedNumber = `#${String(ticketId).padStart(5, '0')}`;

    return formattedNumber;
}
