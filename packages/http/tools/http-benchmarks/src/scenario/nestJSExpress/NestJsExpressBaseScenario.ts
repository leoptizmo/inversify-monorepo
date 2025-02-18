import { Scenario } from '@inversifyjs/benchmark-utils';
import { NestApplication } from '@nestjs/core';

import { Platform } from '../models/Platform';

export abstract class NestJsExpressBaseScenario implements Scenario<Platform> {
  public readonly platform: Platform;

  protected readonly _port: number;
  protected _app!: NestApplication;

  constructor() {
    this.platform = Platform.nestJsExpress;
    this._port = 3002;
  }

  public async tearDown(): Promise<void> {
    await this._app.close();
  }

  public abstract execute(): Promise<void>;

  public abstract setUp(): Promise<void>;
}
