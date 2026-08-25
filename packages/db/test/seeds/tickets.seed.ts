import { DatabaseIdGenerator } from '#root/database-id.utils.js';
import { dbClient } from '#root/database.client.js';
import { type TicketEntity, ticketTable } from '#root/schema/tickets.entity.js';
import type { InputDb } from './seeds.entity.js';
import { generateRandomString } from './seeds.utils.js';

export const TicketsSeed = {
  fakeData(input: Partial<TicketEntity> = {}): InputDb<TicketEntity> {
    const random = generateRandomString();

    return {
      id: DatabaseIdGenerator.generate('t_'),
      title: `Ticket ${random}`,
      description: `Description ${random}`,
      status: 'open',
      priority: 'normal',
      ...input,
    };
  },

  async insert(input: Partial<TicketEntity> = {}): Promise<TicketEntity> {
    const [ticket] = await dbClient.insert(ticketTable).values(TicketsSeed.fakeData(input)).returning();
    return ticket!;
  },

  insertMany(input: Partial<TicketEntity>[] = []): Promise<TicketEntity[]> {
    const partials = input.length ? input : Array.from({ length: 5 }, () => ({}));
    return dbClient.insert(ticketTable).values(partials.map(TicketsSeed.fakeData)).returning();
  },
};
