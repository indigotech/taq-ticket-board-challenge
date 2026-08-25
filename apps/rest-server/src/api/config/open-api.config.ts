import { openapi } from '@elysiajs/openapi';
import type { AnyElysia } from 'elysia';
import { z } from 'zod';
import { Env } from '#env/index.js';

const OPEN_API_PATH = '/docs';
const documentation = {
  info: {
    title: 'Ticket Board API',
    version: '1.0.0',
  },
  tags: [{ name: 'Tickets' }],
};

export function configureOpenApi(app: AnyElysia) {
  if (!Env.OPEN_API_SCHEMA_VISIBLE) {
    return;
  }

  app.use(
    openapi({
      path: OPEN_API_PATH,
      documentation,
      mapJsonSchema: { zod: z.toJSONSchema },
    }),
  );
}
