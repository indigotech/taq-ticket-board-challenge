import { join } from 'node:path';
import { findWorkspaceRoot, readEnvFile } from '@repo/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './migrations',
  dbCredentials: {
    url: databaseUrl(),
  },
});

function databaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const fallback = readEnvFile(join(findWorkspaceRoot(), 'test.env')).DATABASE_URL;

  if (!fallback) {
    throw new Error('DATABASE_URL is not set, and the root test.env carries no fallback');
  }

  return fallback;
}
