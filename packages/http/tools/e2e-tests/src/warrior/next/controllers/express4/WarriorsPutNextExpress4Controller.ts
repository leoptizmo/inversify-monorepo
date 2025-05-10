import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PUT,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express4';

import { NextExpress4Middleware } from '../../middlewares/NextExpress4Middleware';

@controller('/warriors')
export class WarriorsPutNextExpress4Controller {
  @applyMiddleware({
    middleware: NextExpress4Middleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PUT()
  public putWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
