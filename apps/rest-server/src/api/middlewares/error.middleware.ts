import { BaseError, GENERIC_ERROR_MESSAGE, isBaseError } from '@repo/core/error';
import { ApplicationLayer, logger } from '@repo/core/log';
import { type AnyElysia, ValidationError } from 'elysia';
import type { ErrorBody } from '#api/common/common.payload.js';
import { ContextProvider } from '#domain/context/context.provider.js';
import { Env } from '#env/index.js';

const INVALID_DATA_MESSAGE = 'Os dados enviados são inválidos. Por favor, reveja as informações.';

export const useErrorMiddleware = (app: AnyElysia) => {
  app.error({ BaseError });

  app.onError(({ error, code, status, request }) => {
    logger.error({
      error: error as Error,
      layer: ApplicationLayer.Api,
      method: 'useErrorMiddleware',
    });

    const uuid = ContextProvider.get()?.uuid;
    const errors: ErrorBody[] = [];
    let httpStatus = 500;

    if (isBaseError(error)) {
      httpStatus = error.status;
      errors.push({ code: error.code, message: error.message, uuid });
    } else if (error instanceof ValidationError) {
      const details = error.all.map(({ path, message }) => ({ path, message }));
      httpStatus = 422;
      errors.push({
        code: 'VAL_01',
        message: INVALID_DATA_MESSAGE,
        uuid,
        details: Env.OPEN_API_SCHEMA_VISIBLE ? details : undefined,
      });
    } else if (code === 'NOT_FOUND') {
      const url = new URL(request.url);
      const details = { message: `Route ${url.pathname} does not match an existing route.` };
      httpStatus = 404;
      errors.push({
        code: 'GLB_02',
        message: GENERIC_ERROR_MESSAGE,
        uuid,
        details: Env.OPEN_API_SCHEMA_VISIBLE ? details : undefined,
      });
    } else {
      const details = error instanceof Error ? { name: error.name, message: error.message } : error;
      errors.push({
        code: 'GLB_01',
        message: GENERIC_ERROR_MESSAGE,
        uuid,
        details: Env.OPEN_API_SCHEMA_VISIBLE ? details : undefined,
      });
    }

    return status(httpStatus, { errors });
  });
};
