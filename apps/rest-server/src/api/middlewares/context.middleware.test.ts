import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import axios from 'axios';
import { type AnyElysia, Elysia } from 'elysia';
import z from 'zod';
import { ContextProvider } from '#domain/context/context.provider.js';
import type { ServerContext } from '#domain/model/context.model.js';
import { API_PREFIX, configureRestServer } from '../rest.config.js';

describe('Unit - Context Config', () => {
  const port = 10011;
  const basePath = `${port}${API_PREFIX}`;
  let app: AnyElysia;

  async function executeUseCase(routeContext: ServerContext, delayMs = 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    const useCaseContext = ContextProvider.get();
    return { routeContext, useCaseContext };
  }

  const testQuery = z.object({ delayMs: z.coerce.number().optional().default(0) });
  const testResponse = z.object({
    routeContext: z.object({ uuid: z.string() }),
    useCaseContext: z.object({ uuid: z.string() }),
  });

  const testController = new Elysia({ prefix: '/context' }).get(
    '',
    ({ query }) => {
      const routeContext = ContextProvider.get();
      return executeUseCase(routeContext, query.delayMs);
    },
    { query: testQuery, response: { 200: testResponse } },
  );

  beforeAll(async () => {
    app = await configureRestServer({ port, controllers: [testController] });
  });

  afterAll(async () => {
    await app?.stop();
  });

  it('should keep a single context instance per request across awaits', async () => {
    const response = await axios.get(`http://localhost:${basePath}/context`, { params: { delayMs: 5 } });

    expect(response.status).toBe(200);
    expect(response.data.routeContext).toEqual(response.data.useCaseContext);
  });

  it('isolates context between concurrent requests (no leakage)', async () => {
    const [response1, response2] = await Promise.all([
      axios.get(`http://localhost:${basePath}/context`, { params: { delayMs: 15 } }),
      axios.get(`http://localhost:${basePath}/context`, { params: { delayMs: 5 } }),
    ]);

    expect(response1.data.routeContext).toEqual(response1.data.useCaseContext);
    expect(response2.data.routeContext).toEqual(response2.data.useCaseContext);
    expect(response1.data.routeContext).not.toEqual(response2.data.useCaseContext);
  });
});
