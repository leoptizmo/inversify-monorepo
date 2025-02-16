export interface Scenario<TPlatform extends string = string> {
  platform: TPlatform;
  execute(): Promise<void>;
  setUp(): Promise<void>;
  tearDown(): Promise<void>;
}
