import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PUT,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express';

import { NextExpressMiddleware } from '../../middlewares/NextExpressMiddleware';

@controller('/warriors')
export class WarriorsPutNextExpressController {
  @applyMiddleware({
    middleware: NextExpressMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PUT()
  public putWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
