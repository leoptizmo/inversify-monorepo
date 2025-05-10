import {
  applyMiddleware,
  controller,
  GET,
  MiddlewarePhase,
  next,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express4';

import { NextExpress4Middleware } from '../../middlewares/NextExpress4Middleware';

@controller('/warriors')
export class WarriorsGetNextExpress4Controller {
  @applyMiddleware({
    middleware: NextExpress4Middleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @GET()
  public getWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
