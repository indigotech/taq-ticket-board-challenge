import { createLogger, format, transports, type Logger as WinstonLogger } from 'winston';

export enum ApplicationLayer {
  Core = 'Core',
  Api = 'Api',
  Domain = 'Domain',
  Data = 'Data',
}

interface LogErrorParams extends BaseLogParams {
  error: Error;
}

interface LogParams extends BaseLogParams {
  message?: string;
}

interface BaseLogParams {
  className?: string;
  method: string;
  layer: ApplicationLayer;
  [key: string]: any;
}

export type LogType = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export class Logger {
  private readonly logLevel: LogType;
  private readonly getContext: () => Record<string, unknown>;
  private readonly logger: WinstonLogger;

  constructor(logLevel: LogType, getContext: () => Record<string, unknown>) {
    this.logLevel = logLevel;
    this.getContext = getContext;
    this.logger = this.createWinstonLogger();
  }

  debug(params: LogParams): void;
  debug(params: string, ...additionalParams: string[]): void;
  debug(params: any, ...additionalParams: any[]): void {
    this.log('debug', params, ...additionalParams);
  }

  info(params: LogParams): void;
  info(params: string, ...additionalParams: string[]): void;
  info(params: any, ...additionalParams: any[]): void {
    this.log('info', params, ...additionalParams);
  }

  warn(params: LogParams): void;
  warn(params: LogErrorParams): void;
  warn(params: string, ...additionalParams: string[]): void;
  warn(params: any, ...additionalParams: any[]): void {
    this.log('warn', params, ...additionalParams);
  }

  error(params: LogErrorParams): void;
  error(params: string, ...additionalParams: string[]): void;
  error(params: any, ...additionalParams: any[]): void {
    this.log('error', params, ...additionalParams);
  }

  private log(level: string, payload: string | LogParams | LogErrorParams, ...additionalParams: any[]): void {
    const context = this.getContext() ?? {};

    if (typeof payload === 'string') {
      this.logger.log({
        level,
        message: payload + additionalParams?.join(' '),
        context,
      });
    } else {
      const { error, ...additionalInfo } = payload;
      this.logger.log({
        level,
        message: error ?? this.composeLogMessage(additionalInfo),
        context,
        ...additionalInfo,
        ...additionalParams,
      });
    }
  }

  private composeLogMessage(info: LogParams): string {
    let baseMessage = `[${info.layer}] [${info.className ?? 'global'}.${info.method}]`;
    if (info.message) {
      baseMessage += info.message;
    }
    return baseMessage;
  }

  private createWinstonLogger(): WinstonLogger {
    const logger = createLogger({
      level: this.logLevel,
      format: format.combine(format.errors({ stack: true })),
      transports: [],
    });

    logger.add(
      new transports.Console({
        format: format.combine(format.timestamp(), format.colorize(), format.simple()),
      }),
    );

    return logger;
  }
}
