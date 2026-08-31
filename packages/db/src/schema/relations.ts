import { defineRelations } from 'drizzle-orm';
import * as questsSchema from './quests.entity.js';

export const relations = defineRelations({ ...questsSchema });
