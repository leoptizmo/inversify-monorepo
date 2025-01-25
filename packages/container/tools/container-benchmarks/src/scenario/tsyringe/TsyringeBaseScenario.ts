import { Platform } from '../models/Platform';
import { Scenario } from '../models/Scenario';

export abstract class TsyringeBaseScenario implements Scenario {
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
