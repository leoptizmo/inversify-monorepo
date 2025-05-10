import {
  applyMiddleware,
  controller,
  GET,
  MiddlewarePhase,
  next,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express';

import { NextExpressMiddleware } from '../../middlewares/NextExpressMiddleware';

@controller('/warriors')
export class WarriorsGetNextExpressController {
  @applyMiddleware({
    middleware: NextExpressMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @GET()
  public getWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
