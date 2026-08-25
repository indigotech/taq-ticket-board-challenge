import { SQL } from 'bun';
import { drizzle } from 'drizzle-orm/bun-sql';
import type { BunSQLDatabase } from 'drizzle-orm/bun-sql/postgres/driver';
import { relations } from './schema/relations.js';

type DbClient = BunSQLDatabase<typeof relations>;

let client: SQL | undefined;

export let dbClient: DbClient;

export async function configureDatabase(): Promise<void> {
  client = new SQL();
  dbClient = drizzle({ client, relations });

  await client.connect();
}

export async function closeDatabase(): Promise<void> {
  await client?.close();
}
