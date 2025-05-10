import {
  applyMiddleware,
  controller,
  MiddlewarePhase,
  next,
  POST,
} from '@inversifyjs/http-core';

import { NextHonoMiddleware } from '../middlewares/NextHonoMiddleware';

@controller('/warriors')
export class WarriorsPostNextController {
  @applyMiddleware({
    middleware: NextHonoMiddleware,
    phase: MiddlewarePhase.PostHandler,
  })
  @POST()
  public async postWarrior(@next() nextFn: () => Promise<void>): Promise<void> {
    await nextFn();
  }
}
