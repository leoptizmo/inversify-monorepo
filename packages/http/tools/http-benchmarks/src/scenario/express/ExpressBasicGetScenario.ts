import { Request, Response } from 'express';

import { ExpressBaseScenario } from './ExpressBaseScenario';

export class ExpressBasicGetScenario extends ExpressBaseScenario {
  public async execute(): Promise<void> {
    try {
      await fetch(`http://localhost:${String(this._port)}`);
    } catch {
      void 0;
    }
  }

  public async setUp(): Promise<void> {
    this._app.get('/', (_req: Request, res: Response) => {
      res.send('ok');
    });

    this._server = this._app.listen(this._port);
  }
}
