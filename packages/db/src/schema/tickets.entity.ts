import { integer, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from './_table.js';

export const TicketConstraints = {
  uniqueExternalId: 'ticket_external_id_unique',
} as const;

export const ticketTable = pgTable('ticket', {
  id: text('external_id').notNull().unique(TicketConstraints.uniqueExternalId),
  internalId: integer('id').generatedAlwaysAsIdentity().primaryKey(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  status: varchar().notNull().default('open'),
  priority: varchar().notNull().default('normal'),
  createdAt: timestamp({ withTimezone: true, precision: 6 }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true, precision: 6 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true, precision: 6 }),
});

export type TicketEntity = typeof ticketTable.$inferSelect;
