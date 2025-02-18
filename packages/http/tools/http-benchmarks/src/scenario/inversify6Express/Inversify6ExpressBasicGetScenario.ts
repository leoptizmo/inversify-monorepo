import {
  Controller,
  controller,
  httpGet,
  InversifyExpressServer,
} from 'inversify-express-utils';
import { Container } from 'inversify6';

import { Inversify6ExpressBaseScenario } from './Inversify6ExpressBaseScenario';

@controller('')
class AppController implements Controller {
  @httpGet('')
  public ok(): string {
    return 'ok';
  }
}

export class Inversify6ExpressBasicGetScenario extends Inversify6ExpressBaseScenario {
  public override async execute(): Promise<void> {
    try {
      await fetch(`http://localhost:${String(this._port)}`);
    } catch {
      void 0;
    }
  }

  public override async setUp(): Promise<void> {
    const container: Container = new Container();

    const server: InversifyExpressServer = new InversifyExpressServer(
      container,
    );

    this._app = server.build();

    this._server = this._app.listen(this._port);
  }
}
