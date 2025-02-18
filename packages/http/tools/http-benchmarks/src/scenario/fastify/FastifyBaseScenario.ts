import { Scenario } from '@inversifyjs/benchmark-utils';
import fastify, { FastifyInstance } from 'fastify';

import { Platform } from '../models/Platform';

export abstract class FastifyBaseScenario implements Scenario<Platform> {
  public readonly platform: Platform;

  protected readonly _port: number;
  protected _app: FastifyInstance;

  constructor() {
    this.platform = Platform.fastify;
    this._app = fastify();
    this._port = 3001;
  }

  public async tearDown(): Promise<void> {
    await this._app.close();
  }

  public abstract execute(): Promise<void>;

  public abstract setUp(): Promise<void>;
}
