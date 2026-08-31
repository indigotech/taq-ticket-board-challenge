import { AsyncLocalStorage } from 'node:async_hooks';
import { generateUUID } from '@repo/core/utils';
import type { ServerContext } from '#domain/model/context.model.js';

const contextStore = new AsyncLocalStorage<ServerContext>();

export const ContextProvider = {
  set(context: ServerContext) {
    contextStore.enterWith(context);
  },

  get<T extends ServerContext = ServerContext>(): T {
    return (contextStore.getStore() ?? { uuid: generateUUID() }) as T;
  },
};
