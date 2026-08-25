import { TicketsDbDatasource } from '#data/tickets/tickets.db.datasource.js';
import type { Ticket, TicketInput } from '#domain/model/tickets.model.js';

export const CreateTicketUseCase = {
  exec(input: TicketInput): Promise<Ticket> {
    return TicketsDbDatasource.create(input);
  },
};
