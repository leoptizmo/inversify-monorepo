import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  PATCH,
} from '@inversifyjs/http-core';

import { NextHonoMiddleware } from '../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsPatchNextController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @PATCH()
  public async patchWarrior(
    @next() nextFn: () => Promise<void>,
  ): Promise<void> {
    await nextFn();
  }
}
