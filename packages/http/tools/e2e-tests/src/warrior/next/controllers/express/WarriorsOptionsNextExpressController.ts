import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  OPTIONS,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express';

import { NextExpressMiddleware } from '../../middlewares/NextExpressMiddleware';

@controller('/warriors')
export class WarriorsOptionsNextExpressController {
  @applyMiddleware({
    middleware: NextExpressMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @OPTIONS()
  public optionsWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
