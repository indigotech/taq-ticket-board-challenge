import { Elysia, status } from 'elysia';
import { ErrorsResponse } from '#api/common/common.payload.js';
import { CreateQuestUseCase } from '#domain/quests/create-quest.use-case.js';
import { GetQuestUseCase } from '#domain/quests/get-quest.use-case.js';
import { ListQuestsUseCase } from '#domain/quests/list-quests.use-case.js';
import { QuestRequest, QuestResponse, QuestsQuery, QuestsResponse } from './quests.payload.js';

export const QuestsController = new Elysia({ name: 'QuestsController', prefix: '/quests', tags: ['Quests'] })
  .model({ QuestResponse, QuestsResponse, ErrorsResponse })

  .get('', ({ query }) => ListQuestsUseCase.exec(query), {
    detail: { description: 'List quests, optionally filtered by status.' },
    query: QuestsQuery,
    response: { 200: 'QuestsResponse' },
  })

  .get('/:id', ({ params }) => GetQuestUseCase.exec(params.id), {
    detail: { description: 'Get a quest by id.' },
    response: { 200: 'QuestResponse', 404: 'ErrorsResponse' },
  })

  .post(
    '',
    async ({ body }) => {
      return status(201, await CreateQuestUseCase.exec(body));
    },
    {
      detail: { description: 'Create a quest.' },
      body: QuestRequest,
      response: { 201: 'QuestResponse' },
    },
  );
