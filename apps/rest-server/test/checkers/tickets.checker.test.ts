import { expect } from 'bun:test';
import type { TicketEntity } from '@repo/db';
import type { Ticket } from '#domain/model/tickets.model.js';

export function checkTickets(data: Ticket[], entities: TicketEntity[]): void {
  expect(data).toHaveLength(entities.length);
  data.forEach((ticket, index) => checkTicket(ticket, entities[index]!));
}

export function checkTicket(data: Ticket, entity: TicketEntity): void {
  expect(normalizeCreatedAt(data)).toEqual(normalizeCreatedAt(mapTicketToCheck(entity)));
}

export function mapTicketToCheck(ticket: TicketEntity): Ticket {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt,
  };
}

function normalizeCreatedAt(ticket: Ticket): Omit<Ticket, 'createdAt'> & { createdAt: string } {
  return { ...ticket, createdAt: new Date(ticket.createdAt).toISOString() };
}
