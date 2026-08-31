import { afterAll, afterEach, beforeAll, describe, expect, it, mock, spyOn } from 'bun:test';
import { DatabaseIdGenerator, dbClient } from '@repo/db';
import { clearDatabase } from '@repo/db/test';
import { API_PREFIX } from '#api/rest.config.js';
import type { Quest, QuestInput } from '#domain/model/quests.model.js';
import { checkErrors } from '#test/checkers/checker.test.js';
import { checkQuest } from '#test/checkers/quests.checker.test.js';
import { ValidationError } from '#test/checkers/validation.error.test.js';
import { RequestMaker } from '#test/request-maker.test.js';

describe('POST /quests', () => {
  const endpoint = `${API_PREFIX}/quests`;
  const questId = 'q_123';
  const invalidDataMessage = 'Os dados enviados são inválidos. Por favor, reveja as informações.';

  let requestMaker: RequestMaker<Quest, QuestInput>;

  beforeAll(() => {
    requestMaker = new RequestMaker();
    spyOn(DatabaseIdGenerator, 'generate').mockReturnValue(questId);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(() => {
    mock.restore();
  });

  it('should create quest successfully with the default difficulty', async () => {
    const body = { title: 'Login page is throwing 500', description: 'Users report a server error.' };
    const response = await requestMaker.post({ endpoint, body });

    const questDb = (await dbClient.query.questTable.findFirst({ where: { id: questId } }))!;
    checkQuest(response.data, questDb);
    expect(questDb).toEqual({
      id: questId,
      title: body.title,
      description: body.description,
      status: 'open',
      difficulty: 'normal',
      internalId: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deletedAt: null,
    });
  });

  it('should ignore a difficulty sent by the client', async () => {
    const body = { title: 'Urgent: production checkout is down', description: 'desc', difficulty: 'high' } as any;
    const response = await requestMaker.post({ endpoint, body });

    const questDb = (await dbClient.query.questTable.findFirst({ where: { id: questId } }))!;
    checkQuest(response.data, questDb);
    expect(questDb.difficulty).toBe('normal');
  });

  it('should give an error if title is missing', async () => {
    const body = { description: 'desc' } as any;
    const response = await requestMaker.post({ endpoint, body, expectedStatus: 422 });

    checkErrors(response, [
      { code: 'VAL_01', message: invalidDataMessage, details: [{ message: ValidationError.requiredString }] },
    ]);
  });

  it('should give an error if title is not a string', async () => {
    const body = { title: 12345, description: 'desc' } as any;
    const response = await requestMaker.post({ endpoint, body, expectedStatus: 422 });

    checkErrors(response, [
      {
        code: 'VAL_01',
        message: invalidDataMessage,
        details: [{ message: ValidationError.invalidStringType }],
      },
    ]);
  });

  it('should give an error if description is missing', async () => {
    const body = { title: 'Missing description' } as any;
    const response = await requestMaker.post({ endpoint, body, expectedStatus: 422 });

    checkErrors(response, [
      { code: 'VAL_01', message: invalidDataMessage, details: [{ message: ValidationError.requiredString }] },
    ]);
  });
});
