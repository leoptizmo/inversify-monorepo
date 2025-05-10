import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PATCH,
} from '@inversifyjs/http-core';
import { Next } from 'hono';

import { NextHonoMiddleware } from '../../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsPatchNextHonoController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PATCH()
  public async patchWarrior(@next() nextFn: Next): Promise<void> {
    await nextFn();
  }
}
