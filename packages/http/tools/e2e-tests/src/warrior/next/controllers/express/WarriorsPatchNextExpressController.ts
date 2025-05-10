import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PATCH,
} from '@inversifyjs/http-core';
import { NextFunction } from 'express';

import { NextExpressMiddleware } from '../../middlewares/NextExpressMiddleware';

@controller('/warriors')
export class WarriorsPatchNextExpressController {
  @applyMiddleware({
    middleware: NextExpressMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PATCH()
  public patchWarrior(@next() nextFn: NextFunction): void {
    nextFn();
  }
}
