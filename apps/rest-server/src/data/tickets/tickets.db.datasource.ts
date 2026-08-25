import type { PageInput, Paginated } from '@repo/core/pagination';
import { buildPageInfo } from '@repo/core/pagination';
import { DatabaseIdGenerator, dbClient, ticketTable } from '@repo/db';
import { and, count, eq, isNull } from 'drizzle-orm';
import type { Ticket, TicketInput } from '#domain/model/tickets.model.js';

const EXTERNAL_ID_PREFIX = 't_';

export const TicketsDbDatasource = {
  async create(input: TicketInput): Promise<Ticket> {
    const id = DatabaseIdGenerator.generate(EXTERNAL_ID_PREFIX);
    const createdAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const [ticket] = await dbClient
      .insert(ticketTable)
      .values({ ...input, id, createdAt })
      .returning();

    return ticket!;
  },

  async findOneById(id: string): Promise<Ticket | null> {
    const ticket = await dbClient.query.ticketTable.findFirst({ where: { id, deletedAt: { isNull: true } } });
    return ticket ?? null;
  },

  async findMany(status: string | undefined, page: PageInput): Promise<Paginated<Ticket>> {
    const offset = page.offset ?? 0;

    const [nodes, totalItems] = await Promise.all([
      dbClient.query.ticketTable.findMany({
        where: status ? { status, deletedAt: { isNull: true } } : { deletedAt: { isNull: true } },
        orderBy: { createdAt: 'desc' },
        limit: page.limit,
        offset,
      }),
      countActiveTickets(status),
    ]);

    return { nodes, count: totalItems, pageInfo: buildPageInfo(page, totalItems) };
  },
};

async function countActiveTickets(status?: string): Promise<number> {
  const activeFilter = isNull(ticketTable.deletedAt);
  const where = status ? and(activeFilter, eq(ticketTable.status, status)) : activeFilter;

  const [row] = await dbClient.select({ value: count() }).from(ticketTable).where(where);
  return row!.value;
}
