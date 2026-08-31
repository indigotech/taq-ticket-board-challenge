import { ApplicationLayer, logger } from '@repo/core/log';
import { closeDatabase } from '@repo/db';
import { configureServer } from './server.config.js';

const TERMINATION_SIGNALS = ['SIGTERM', 'SIGINT'] as const;

const server = await configureServer('.env');

for (const signal of TERMINATION_SIGNALS) {
  process.on(signal, async () => {
    try {
      await server.stop();
      await closeDatabase();
      logger.info({ layer: ApplicationLayer.Api, method: 'shutdown', message: `Drained on ${signal}` });
      process.exit(0);
    } catch (error) {
      logger.error({ error: error as Error, layer: ApplicationLayer.Api, method: 'shutdown' });
      process.exit(1);
    }
  });
}
