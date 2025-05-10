import {
  applyMiddleware,
  controller,
  DELETE,
  MiddlewarePhase,
  next,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express4';

import { NextExpress4Middleware } from '../../middlewares/NextExpress4Middleware';

@controller('/warriors')
export class WarriorsDeleteNextExpress4Controller {
  @applyMiddleware({
    middleware: NextExpress4Middleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @DELETE()
  public deleteWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
