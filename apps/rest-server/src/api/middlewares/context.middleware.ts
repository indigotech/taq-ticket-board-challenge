import { generateUUID } from '@repo/core/utils';
import type { AnyElysia } from 'elysia';
import { ContextProvider } from '#domain/context/context.provider.js';
import type { ServerContext } from '#domain/model/context.model.js';

export const useContextMiddleware = (app: AnyElysia) => {
  app.derive(() => {
    const context: ServerContext = { uuid: generateUUID() };
    ContextProvider.set(context);
  });
};
