import { Scenario } from '@inversifyjs/benchmark-utils';

import { Platform } from '../models/Platform';

export abstract class TsyringeBaseScenario implements Scenario<Platform> {
  public readonly platform: Platform;

  constructor() {
    this.platform = Platform.tsyringe;
  }

  public async setUp(): Promise<void> {
    return undefined;
  }

  public async tearDown(): Promise<void> {
    return undefined;
  }

  public abstract execute(): Promise<void>;
}
