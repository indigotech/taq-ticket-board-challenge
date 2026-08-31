import { afterAll, beforeAll } from 'bun:test';
import { closeDatabase } from '@repo/db';
import type { AnyElysia } from 'elysia';
import { configureServer } from '../src/server.config.js';

let server: AnyElysia;

beforeAll(async () => {
  server = await configureServer('test.env');
});

afterAll(async () => {
  await closeDatabase();
  await server.stop();
});
