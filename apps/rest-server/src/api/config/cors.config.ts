import { cors } from '@elysiajs/cors';
import type { AnyElysia } from 'elysia';
import { helmet } from 'elysia-helmet';

export function configureCors(app: AnyElysia) {
  app.use(cors());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        },
      },
    }),
  );
}
