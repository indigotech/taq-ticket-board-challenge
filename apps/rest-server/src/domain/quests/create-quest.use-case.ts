import { QuestsDbDatasource } from '#data/quests/quests.db.datasource.js';
import type { Quest, QuestInput } from '#domain/model/quests.model.js';

export const CreateQuestUseCase = {
  exec(input: QuestInput): Promise<Quest> {
    return QuestsDbDatasource.create(input);
  },
};
