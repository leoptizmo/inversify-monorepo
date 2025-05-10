import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  POST,
} from '@inversifyjs/http-core';
import { Next } from 'hono';

import { NextHonoMiddleware } from '../../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsPostNextHonoController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @POST()
  public async putWarrior(@next() nextFn: Next): Promise<void> {
    await nextFn();
  }
}
