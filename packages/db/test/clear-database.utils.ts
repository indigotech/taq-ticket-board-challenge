import { getTableName, is, sql, Table } from 'drizzle-orm';
import { dbClient } from '#root/database.client.js';
import * as schema from '#root/schema/index.js';

const TABLES = Object.values(schema)
  .filter(exported => is(exported, Table))
  .map(table => `"${getTableName(table)}"`)
  .join(', ');

export async function clearDatabase() {
  await dbClient.execute(sql.raw(`TRUNCATE TABLE ${TABLES} CASCADE;`));
}
