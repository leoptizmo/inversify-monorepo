import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  OPTIONS,
} from '@inversifyjs/http-core';
import { Next } from 'hono';

import { NextHonoMiddleware } from '../../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsOptionsNextHonoController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @OPTIONS()
  public async optionsWarrior(@next() nextFn: Next): Promise<void> {
    await nextFn();
  }
}
