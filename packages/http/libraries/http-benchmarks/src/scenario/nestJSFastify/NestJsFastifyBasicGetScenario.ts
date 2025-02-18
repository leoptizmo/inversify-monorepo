import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

import { BasicGetAppModule } from '../nestJS/BasicGetAppModule';
import { NestJsFastifyBaseScenario } from './NestJsFastifyBaseScenario';

export class NestJsFastifyBasicGetScenario extends NestJsFastifyBaseScenario {
  public override async execute(): Promise<void> {
    try {
      await fetch(`http://localhost:${String(this._port)}`);
    } catch {
      void 0;
    }
  }

  public override async setUp(): Promise<void> {
    this._app = await NestFactory.create(
      BasicGetAppModule,
      new FastifyAdapter({ logger: false }),
    );

    await this._app.listen(this._port, '0.0.0.0');
  }
}
