import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Tickets table schema for Drizzle ORM.
 * Stores all generated conference tickets.
 */
export const tickets = pgTable('tickets', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    githubUsername: varchar('github_username', { length: 255 }).notNull(),
    avatarUrl: text('avatar_url').notNull(),
    ticketNumber: varchar('ticket_number', { length: 7 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});





/*
    | Type           | Purpose                 |
| -------------- | ----------------------- |
| `$inferSelect` | Data **coming from** DB |
| `$inferInsert` | Data **going into** DB  |



*/

/* 
    Ticket     → shape of a ticket you READ from the database
NewTicket  → shape of a ticket you WRITE into the database


*/

// * tickets is the table
// Ticket is like an interface

// Data shape
// Ticket
// interface Ticket {}
export type Ticket = typeof tickets.$inferSelect;



// Insert shape
// NewTicket
// interface NewTicket {}
export type NewTicket = typeof tickets.$inferInsert;
