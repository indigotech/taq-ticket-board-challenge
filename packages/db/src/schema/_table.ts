import { pgTableCreator } from 'drizzle-orm/pg-core';

// Drizzle v1 removed the client-side `casing` option — it lives on the table factory now.
export const pgTable = pgTableCreator(name => name, 'snake_case');
