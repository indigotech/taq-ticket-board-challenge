import { Elysia, status } from 'elysia';
import { ErrorsResponse } from '#api/common/common.payload.js';
import { CreateTicketUseCase } from '#domain/tickets/create-ticket.use-case.js';
import { GetTicketUseCase } from '#domain/tickets/get-ticket.use-case.js';
import { ListTicketsUseCase } from '#domain/tickets/list-tickets.use-case.js';
import { TicketRequest, TicketResponse, TicketsQuery, TicketsResponse } from './tickets.payload.js';

export const TicketsController = new Elysia({ name: 'TicketsController', prefix: '/tickets', tags: ['Tickets'] })
  .model({ TicketResponse, TicketsResponse, ErrorsResponse })

  .get('', ({ query }) => ListTicketsUseCase.exec(query), {
    detail: { description: 'List tickets, optionally filtered by status.' },
    query: TicketsQuery,
    response: { 200: 'TicketsResponse' },
  })

  .get('/:id', ({ params }) => GetTicketUseCase.exec(params.id), {
    detail: { description: 'Get a ticket by id.' },
    response: { 200: 'TicketResponse', 404: 'ErrorsResponse' },
  })

  .post(
    '',
    async ({ body }) => {
      return status(201, await CreateTicketUseCase.exec(body));
    },
    {
      detail: { description: 'Create a ticket.' },
      body: TicketRequest,
      response: { 201: 'TicketResponse' },
    },
  );
