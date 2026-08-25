import { ApplicationLayer, logger } from '@repo/core/log';
import { type AnyElysia, Elysia } from 'elysia';
import { ErrorsResponse } from './common/common.payload.js';
import { configureCors } from './config/cors.config.js';
import { configureOpenApi } from './config/open-api.config.js';
import { useContextMiddleware } from './middlewares/context.middleware.js';
import { useErrorMiddleware } from './middlewares/error.middleware.js';

interface ConfigRestParams {
  port: number;
  controllers: AnyElysia[];
}

export const API_PREFIX = '/api/v1';

export async function configureRestServer(params: ConfigRestParams): Promise<AnyElysia> {
  const { port, controllers } = params;

  const app = new Elysia({ prefix: API_PREFIX }).model({ ErrorsResponse });

  configureCors(app);
  useContextMiddleware(app);
  useErrorMiddleware(app);

  controllers.forEach(controller => {
    validateRoutes(controller);
    app.use(controller);
  });

  configureOpenApi(app);

  return new Promise((resolve, reject) => {
    try {
      app.listen({ port }, ({ url }) => {
        logger.info(`Server listening on ${url}`);
        resolve(app);
      });
    } catch (error) {
      logger.error({
        error: error as Error,
        layer: ApplicationLayer.Api,
        method: 'configureRestServer',
      });
      reject(error);
    }
  });
}

function validateRoutes(controller: AnyElysia): void {
  const trailingSlashRoute = controller.routes.find(route => route.path.endsWith('/'));
  if (trailingSlashRoute) {
    throw new Error(`REST route must not have a trailing slash: ${trailingSlashRoute.path}`);
  }
}
