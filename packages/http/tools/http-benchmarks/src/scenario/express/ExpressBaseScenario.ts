import { Scenario } from '@inversifyjs/benchmark-utils';
import express, { Express } from 'express';
import { Server } from 'http';

import { Platform } from '../models/Platform';

export abstract class ExpressBaseScenario implements Scenario<Platform> {
  public readonly platform: Platform;

  protected readonly _app: Express;
  protected _server!: Server;
  protected readonly _port: number;

  constructor() {
    this.platform = Platform.express;
    this._app = express();
    this._port = 3000;
  }

  public async tearDown(): Promise<void> {
    this._server.close();
  }

  public abstract execute(): Promise<void>;

  public abstract setUp(): Promise<void>;
}
