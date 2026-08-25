import { z } from 'zod';

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().default(3000),
  NPM_CONFIG_PRODUCTION: z.stringbool().default(false),
  LOGGER_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'critical']).default('info'),
  DATABASE_URL: z.url(),
  OPEN_API_SCHEMA_VISIBLE: z.stringbool().default(false),
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;
