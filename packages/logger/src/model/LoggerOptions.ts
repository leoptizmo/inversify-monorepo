import { LogLevel } from './LogLevel';

export interface LoggerOptions {
  json?: boolean;
  logTypes?: LogLevel[];
  timestamp?: boolean;
}
