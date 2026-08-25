import { defineRelations } from 'drizzle-orm';
import * as ticketsSchema from './tickets.entity.js';

export const relations = defineRelations({ ...ticketsSchema });
