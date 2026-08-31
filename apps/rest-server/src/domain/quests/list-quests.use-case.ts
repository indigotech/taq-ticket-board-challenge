import type { PageInput, Paginated } from '@repo/core/pagination';
import { QuestsDbDatasource } from '#data/quests/quests.db.datasource.js';
import type { Quest, QuestStatus } from '#domain/model/quests.model.js';

export interface ListQuestsInput extends PageInput {
  status?: QuestStatus;
}

export const ListQuestsUseCase = {
  exec({ status, ...page }: ListQuestsInput): Promise<Paginated<Quest>> {
    return QuestsDbDatasource.findMany(status, page);
  },
};
