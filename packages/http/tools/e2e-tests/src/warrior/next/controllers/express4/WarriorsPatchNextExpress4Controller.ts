import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PATCH,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express4';

import { NextExpress4Middleware } from '../../middlewares/NextExpress4Middleware';

@controller('/warriors')
export class WarriorsPatchNextExpress4Controller {
  @applyMiddleware({
    middleware: NextExpress4Middleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PATCH()
  public patchWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
