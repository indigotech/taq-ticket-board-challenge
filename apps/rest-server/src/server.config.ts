import { configureLogger } from '@repo/core/log';
import { configureDatabase } from '@repo/db';
import type { AnyElysia } from 'elysia';
import z from 'zod';
import { Controllers } from '#api/controllers.js';
import { configureRestServer } from '#api/rest.config.js';
import { ContextProvider } from '#domain/context/context.provider.js';
import { configureEnv, Env } from '#env/index.js';

export async function configureServer(envFile: string): Promise<AnyElysia> {
  configureEnv(envFile);
  configureLogger(Env.LOGGER_LEVEL, ContextProvider.get);
  z.config(z.locales.pt());

  await configureDatabase();

  return configureRestServer({ port: Env.PORT ?? 3000, controllers: Controllers });
}
