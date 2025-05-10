import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  OPTIONS,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express4';

import { NextExpress4Middleware } from '../../middlewares/NextExpress4Middleware';

@controller('/warriors')
export class WarriorsOptionsNextExpress4Controller {
  @applyMiddleware({
    middleware: NextExpress4Middleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @OPTIONS()
  public optionsWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
