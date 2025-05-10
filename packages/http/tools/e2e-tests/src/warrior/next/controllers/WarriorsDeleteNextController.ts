import {
  applyMiddleware,
  controller,
  DELETE,
  MiddlewarePhase,
  next,
} from '@inversifyjs/http-core';

import { NextHonoMiddleware } from '../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsDeleteNextController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @DELETE()
  public async deleteWarrior(
    @next() nextFn: () => Promise<void>,
  ): Promise<void> {
    await nextFn();
  }
}
