import { LoggerOptions } from '../../model/LoggerOptions';
import { LogLevel } from '../../model/LogLevel';
import { ContextMetadata } from '../model/ContextMetadata';
import { Logger } from '../model/Logger';

export abstract class LoggerAdapter implements Logger {
  readonly #context: string | undefined;

  constructor(
    context?: string,
    protected readonly _loggerOptions: LoggerOptions = {
      json: true,
      logTypes: [
        LogLevel.DEBUG,
        LogLevel.ERROR,
        LogLevel.HTTP,
        LogLevel.INFO,
        LogLevel.SILLY,
        LogLevel.VERBOSE,
        LogLevel.WARN,
      ],
      timestamp: true,
    },
  ) {
    this.#context = context;
  }

  public info(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogLevel.INFO, message, contextMetadata);
  }

  public http(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogLevel.HTTP, message, contextMetadata);
  }

  public silly(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogLevel.SILLY, message, contextMetadata);
  }

  public log(
    logType: LogLevel,
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
    this.log(LogLevel.ERROR, message, contextMetadata);
  }

  public warn(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogLevel.WARN, message, contextMetadata);
  }

  public debug(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogLevel.DEBUG, message, contextMetadata);
  }

  public verbose(message: string, contextMetadata?: ContextMetadata): void {
    this.log(LogLevel.VERBOSE, message, contextMetadata);
  }

  protected abstract printLog(
    logType: LogLevel,
    message: string,
    context?: ContextMetadata,
  ): void;
}
