import { Format, TransformableInfo } from 'logform';
import { format, Logger } from 'winston';

import { LoggerAdapter } from '../../logger/adapter/LoggerAdapter';
import { ContextMetadata } from '../../logger/model/ContextMetadata';
import { LoggerOptions } from '../../model/LoggerOptions';
import { LogType } from '../../model/LogType';

export class WinstonLoggerAdapter extends LoggerAdapter {
  readonly #logger: Logger;

  constructor(logger: Logger, context?: string, loggerOptions?: LoggerOptions) {
    super(context, loggerOptions);
    this.#logger = logger;

    const formatList: Format[] = [];

    if (this._loggerOptions.timestamp) {
      formatList.push(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
      );
    }

    if (this._loggerOptions.json) {
      formatList.push(format.json(), format.prettyPrint());
    } else {
      formatList.push(
        format.colorize({ all: true }),
        format.printf(
          (info: TransformableInfo): string =>
            `[InversifyJS] - ${String(process.pid)}${this._loggerOptions.timestamp ? ` ${info['timestamp'] as string}` : ''} ${info.level}${info['context'] !== undefined ? ` [${info['context'] as string}]` : ''}: ${info.message as string}`,
        ),
      );
    }

    this.#logger.format = format.combine(this.#logger.format, ...formatList);
  }

  protected printLog(
    logType: LogType,
    message: string,
    context?: ContextMetadata,
  ): void {
    this.#logger.log(logType, message, context);
  }
}
