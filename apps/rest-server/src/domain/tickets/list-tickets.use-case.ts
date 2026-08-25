import type { PageInput, Paginated } from '@repo/core/pagination';
import { TicketsDbDatasource } from '#data/tickets/tickets.db.datasource.js';
import type { Ticket } from '#domain/model/tickets.model.js';

export interface ListTicketsInput extends PageInput {
  status?: string;
}

export const ListTicketsUseCase = {
  exec({ status, ...page }: ListTicketsInput): Promise<Paginated<Ticket>> {
    return TicketsDbDatasource.findMany(status, page);
  },
};
