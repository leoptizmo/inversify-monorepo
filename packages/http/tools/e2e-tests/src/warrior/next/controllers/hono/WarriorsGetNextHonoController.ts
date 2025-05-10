import {
  applyMiddleware,
  controller,
  GET,
  MiddlewarePhase,
  next,
} from '@inversifyjs/http-core';
import { Next } from 'hono';

import { NextHonoMiddleware } from '../../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsGetNextHonoController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @GET()
  public async getWarrior(@next() nextFn: Next): Promise<void> {
    await nextFn();
  }
}
