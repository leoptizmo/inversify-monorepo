import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  OPTIONS,
} from '@inversifyjs/http-core';

import { NextHonoMiddleware } from '../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsOptionsNextController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @OPTIONS()
  public async optionsWarrior(
    @next() nextFn: () => Promise<void>,
  ): Promise<void> {
    await nextFn();
  }
}
