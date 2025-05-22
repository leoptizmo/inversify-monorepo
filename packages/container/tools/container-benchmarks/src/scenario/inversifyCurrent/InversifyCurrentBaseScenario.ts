import { Container } from '@gritcode/inversifyjs-container';
import { Scenario } from '@inversifyjs/benchmark-utils';

import { Platform } from '../models/Platform';

export abstract class InversifyCurrentBaseScenario
  implements Scenario<Platform>
{
  public readonly platform: Platform;

  protected readonly _container: Container;

  constructor() {
    this._container = new Container();
    this.platform = Platform.inversifyCurrent;
  }

  public async setUp(): Promise<void> {
    return undefined;
  }

  public async tearDown(): Promise<void> {
    return undefined;
  }

  public abstract execute(): Promise<void>;
}
