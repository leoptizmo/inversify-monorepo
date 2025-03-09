import { createLogger, transports } from 'winston';

import { LoggerOptions } from '../model/LoggerOptions';
import { WinstonLoggerAdapter } from '../winston/adapter/WinstonLoggerAdapter';

export class FileLogger extends WinstonLoggerAdapter {
  constructor(
    fileName: string,
    context?: string,
    loggerOptions?: LoggerOptions,
  ) {
    super(
      createLogger({
        transports: [new transports.File({ filename: fileName })],
      }),
      context,
      loggerOptions,
    );
  }
}
