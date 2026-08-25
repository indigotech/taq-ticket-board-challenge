import type { Paginated } from '@repo/core/pagination';
import { type ZodType, z } from 'zod';
import { PageRequest, PaginatedResponse } from '#api/common/common.payload.js';
import type { Ticket, TicketInput } from '#domain/model/tickets.model.js';
import type { ListTicketsInput } from '#domain/tickets/list-tickets.use-case.js';

export const TicketResponse = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.string(),
    priority: z.string(),
    createdAt: z.date(),
  })
  .meta({ id: 'TicketResponse' }) satisfies ZodType<Ticket>;

export const TicketRequest = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
}) satisfies ZodType<TicketInput>;

export const TicketsQuery = PageRequest.safeExtend({
  status: z.string().trim().min(1).optional(),
}) satisfies ZodType<ListTicketsInput>;

export const TicketsResponse = PaginatedResponse(TicketResponse).meta({ id: 'TicketsResponse' }) satisfies ZodType<
  Paginated<Ticket>
>;
