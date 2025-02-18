import { NestFactory } from '@nestjs/core';

import { BasicGetAppModule } from '../nestJS/BasicGetAppModule';
import { NestJsExpressBaseScenario } from './NestJsExpressBaseScenario';

export class NestJsExpressBasicGetScenario extends NestJsExpressBaseScenario {
  public override async execute(): Promise<void> {
    try {
      await fetch(`http://localhost:${String(this._port)}`);
    } catch {
      void 0;
    }
  }

  public override async setUp(): Promise<void> {
    this._app = await NestFactory.create(BasicGetAppModule, { logger: false });

    await this._app.listen(this._port);
  }
}
