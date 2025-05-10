import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PUT,
} from '@inversifyjs/http-core';
import { Next } from 'hono';

import { NextHonoMiddleware } from '../../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsPutNextHonoController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PUT()
  public async putWarrior(@next() nextFn: Next): Promise<void> {
    await nextFn();
  }
}
