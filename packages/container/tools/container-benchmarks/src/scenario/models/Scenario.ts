import { Platform } from './Platform';

export interface Scenario {
  platform: Platform;
  execute(): Promise<void>;
  setUp(): Promise<void>;
  tearDown(): Promise<void>;
}
