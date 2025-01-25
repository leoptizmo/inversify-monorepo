import { Container } from 'inversify6';

import { Platform } from '../models/Platform';
import { Scenario } from '../models/Scenario';

export abstract class Inversify6BaseScenario implements Scenario {
  public readonly platform: Platform;

  protected readonly _container: Container;

  constructor() {
    this._container = new Container();
    this.platform = Platform.inversify6;
  }

  public async setUp(): Promise<void> {
    return undefined;
  }

  public async tearDown(): Promise<void> {
    return undefined;
  }

  public abstract execute(): Promise<void>;
}
