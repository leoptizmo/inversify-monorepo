import {
  applyMiddleware,
  controller,
  GET,
  MiddlewarePhase,
  next,
} from '@inversifyjs/http-core';

import { NextHonoMiddleware } from '../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsGetNextController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @GET()
  public async getWarrior(@next() nextFn: () => Promise<void>): Promise<void> {
    await nextFn();
  }
}
