import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import type { Paginated } from '@repo/core/pagination';
import { clearDatabase, TicketsSeed } from '@repo/db/test';
import { API_PREFIX } from '#api/rest.config.js';
import type { Ticket } from '#domain/model/tickets.model.js';
import { checkEmptyList, checkPage } from '#test/checkers/checker.test.js';
import { checkTickets } from '#test/checkers/tickets.checker.test.js';
import { RequestMaker } from '#test/request-maker.test.js';

describe('GET /tickets', () => {
  const endpoint = `${API_PREFIX}/tickets`;

  let requestMaker: RequestMaker<Paginated<Ticket>>;

  beforeEach(() => {
    requestMaker = new RequestMaker();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should return an empty list when there are no tickets', async () => {
    const response = await requestMaker.get({ endpoint });

    checkEmptyList(response.data);
  });

  it('should list tickets ordered by newest first', async () => {
    const older = await TicketsSeed.insert({ createdAt: new Date('2026-01-01T00:00:00Z') });
    const newer = await TicketsSeed.insert({ createdAt: new Date('2026-01-02T00:00:00Z') });

    const response = await requestMaker.get({ endpoint });

    expect(response.data.count).toBe(2);
    checkTickets(response.data.nodes, [newer, older]);
  });

  it('should filter tickets by status', async () => {
    const openTicket = await TicketsSeed.insert({ status: 'open' });
    await TicketsSeed.insert({ status: 'resolved' });

    const response = await requestMaker.get({ endpoint, query: { status: 'open' } });

    checkTickets(response.data.nodes, [openTicket]);
  });

  it('should paginate results using limit', async () => {
    await TicketsSeed.insertMany([{}, {}, {}]);

    const response = await requestMaker.get({ endpoint, query: { limit: 2 } });

    expect(response.data.nodes).toHaveLength(2);
    expect(response.data.count).toBe(3);
    checkPage(response.data.pageInfo, { limit: 2, hasNextPage: true });
  });
});
