import { LoggerOptions } from '../../model/LoggerOptions';
import { LogType } from '../../model/LogType';
import { ContextMetadata } from '../model/ContextMetadata';
import { Logger } from '../model/Logger';

export abstract class LoggerAdapter implements Logger {
  readonly #context: string | undefined;

  constructor(
    context?: string,
    protected readonly _loggerOptions: LoggerOptions = {
      json: true,
      logTypes: [
        LogType.DEBUG,
        LogType.ERROR,
        LogType.HTTP,
        LogType.INFO,
        LogType.SILLY,
        LogType.VERBOSE,
        LogType.WARN,
      ],
      timestamp: true,
    },
  ) {
    this.#context = context;
  }

  public info(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.INFO, message, contextMetadata);
  }

  public http(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.HTTP, message, contextMetadata);
  }

  public silly(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.SILLY, message, contextMetadata);
  }

  public log(
    logType: LogType,
    message: string,
    contextMetadata?: ContextMetadata,
  ): void {
    if (this._loggerOptions.logTypes.includes(logType)) {
      this.printLog(logType, message, {
        ...contextMetadata,
        context: contextMetadata?.context ?? this.#context,
      });
    }
  }

  public error(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.ERROR, message, contextMetadata);
  }

  public warn(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.WARN, message, contextMetadata);
  }

  public debug(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.DEBUG, message, contextMetadata);
  }

  public verbose(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogType.VERBOSE, message, contextMetadata);
  }

  protected abstract printLog(
    logType: LogType,
    message: string,
    context?: ContextMetadata,
  ): void;
}
