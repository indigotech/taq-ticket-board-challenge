import type { PageInput, Paginated } from '@repo/core/pagination';
import { buildPageInfo } from '@repo/core/pagination';
import { DatabaseIdGenerator, dbClient, type QuestEntity, questTable } from '@repo/db';
import { and, count, eq, isNull } from 'drizzle-orm';
import type { Quest, QuestInput, QuestStatus } from '#domain/model/quests.model.js';
import { calculateXpReward } from '#domain/quests/quests.utils.js';

const EXTERNAL_ID_PREFIX = 'q_';

export const QuestsDbDatasource = {
  async create(input: QuestInput): Promise<Quest> {
    const id = DatabaseIdGenerator.generate(EXTERNAL_ID_PREFIX);
    const createdAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

    const [quest] = await dbClient
      .insert(questTable)
      .values({ ...input, id, createdAt })
      .returning();

    return toQuest(quest!);
  },

  async findOneById(id: string): Promise<Quest | null> {
    const quest = await dbClient.query.questTable.findFirst({ where: { id, deletedAt: { isNull: true } } });
    return quest ? toQuest(quest) : null;
  },

  async findMany(status: QuestStatus | undefined, page: PageInput): Promise<Paginated<Quest>> {
    const offset = page.offset ?? 0;

    const [nodes, totalItems] = await Promise.all([
      dbClient.query.questTable.findMany({
        where: status ? { status, deletedAt: { isNull: true } } : { deletedAt: { isNull: true } },
        orderBy: { createdAt: 'desc' },
        limit: page.limit,
        offset,
      }),
      countActiveQuests(status),
    ]);

    return { nodes: nodes.map(toQuest), count: totalItems, pageInfo: buildPageInfo(page, totalItems) };
  },
};

function toQuest(entity: QuestEntity): Quest {
  const difficulty = entity.difficulty as Quest['difficulty'];

  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    status: entity.status as QuestStatus,
    difficulty,
    xpReward: calculateXpReward(difficulty),
    createdAt: entity.createdAt,
  };
}

async function countActiveQuests(status?: QuestStatus): Promise<number> {
  const activeFilter = isNull(questTable.deletedAt);
  const where = status ? and(activeFilter, eq(questTable.status, status)) : activeFilter;

  const [row] = await dbClient.select({ value: count() }).from(questTable).where(where);
  return row!.value;
}
