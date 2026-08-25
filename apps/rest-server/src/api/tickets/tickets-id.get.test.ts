import { afterEach, beforeEach, describe, it } from 'bun:test';
import { clearDatabase, TicketsSeed } from '@repo/db/test';
import { API_PREFIX } from '#api/rest.config.js';
import type { Ticket } from '#domain/model/tickets.model.js';
import { TicketErrors } from '#domain/tickets/tickets.error.js';
import { checkErrors } from '#test/checkers/checker.test.js';
import { checkTicket } from '#test/checkers/tickets.checker.test.js';
import { RequestMaker } from '#test/request-maker.test.js';

describe('GET /tickets/:id', () => {
  let requestMaker: RequestMaker<Ticket>;

  beforeEach(() => {
    requestMaker = new RequestMaker();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should return the ticket successfully', async () => {
    const ticketDb = await TicketsSeed.insert();

    const response = await requestMaker.get({ endpoint: `${API_PREFIX}/tickets/${ticketDb.id}` });

    checkTicket(response.data, ticketDb);
  });

  it('should give a 404 error if the ticket does not exist', async () => {
    const response = await requestMaker.get({ endpoint: `${API_PREFIX}/tickets/t_missing`, expectedStatus: 404 });

    checkErrors(response, [TicketErrors.NotFound]);
  });
});
