import { afterEach, beforeEach, describe, it } from 'bun:test';
import { clearDatabase, QuestsSeed } from '@repo/db/test';
import { API_PREFIX } from '#api/rest.config.js';
import type { Quest } from '#domain/model/quests.model.js';
import { QuestErrors } from '#domain/quests/quests.error.js';
import { checkErrors } from '#test/checkers/checker.test.js';
import { checkQuest } from '#test/checkers/quests.checker.test.js';
import { RequestMaker } from '#test/request-maker.test.js';

describe('GET /quests/:id', () => {
  let requestMaker: RequestMaker<Quest>;

  beforeEach(() => {
    requestMaker = new RequestMaker();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  it('should return the quest successfully', async () => {
    const questDb = await QuestsSeed.insert();

    const response = await requestMaker.get({ endpoint: `${API_PREFIX}/quests/${questDb.id}` });

    checkQuest(response.data, questDb);
  });

  it('should give a 404 error if the quest does not exist', async () => {
    const response = await requestMaker.get({ endpoint: `${API_PREFIX}/quests/q_missing`, expectedStatus: 404 });

    checkErrors(response, [QuestErrors.NotFound]);
  });
});
