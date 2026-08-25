import { NotFoundError } from '@repo/core/error';
import { TicketsDbDatasource } from '#data/tickets/tickets.db.datasource.js';
import type { Ticket } from '#domain/model/tickets.model.js';
import { TicketErrors } from './tickets.error.js';

export const GetTicketUseCase = {
  async exec(id: string): Promise<Ticket> {
    const ticket = await TicketsDbDatasource.findOneById(id);

    if (!ticket) {
      throw new NotFoundError(TicketErrors.NotFound);
    }

    return ticket;
  },
};
