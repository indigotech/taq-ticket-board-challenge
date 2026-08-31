import { NotFoundError } from '@repo/core/error';
import { QuestsDbDatasource } from '#data/quests/quests.db.datasource.js';
import type { Quest } from '#domain/model/quests.model.js';
import { QuestErrors } from './quests.error.js';

export const GetQuestUseCase = {
  async exec(id: string): Promise<Quest> {
    const quest = await QuestsDbDatasource.findOneById(id);

    if (!quest) {
      throw new NotFoundError(QuestErrors.NotFound);
    }

    return quest;
  },
};
