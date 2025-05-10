import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  POST,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express';

import { NextExpressMiddleware } from '../../middlewares/NextExpressMiddleware';

@controller('/warriors')
export class WarriorsPostNextExpressController {
  @applyMiddleware({
    middleware: NextExpressMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @POST()
  public postWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
