import { Logger, type LogType } from './logger.js';

export * from './logger.js';

export let logger: Logger;

export function configureLogger(level: LogType, getContext: () => Record<string, any>) {
  logger = new Logger(level, getContext);
}
