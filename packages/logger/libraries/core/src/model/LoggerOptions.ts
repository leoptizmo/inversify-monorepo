import { LogType } from './LogType';

export interface LoggerOptions {
  json: boolean;
  logTypes: LogType[];
  timestamp: boolean;
}
