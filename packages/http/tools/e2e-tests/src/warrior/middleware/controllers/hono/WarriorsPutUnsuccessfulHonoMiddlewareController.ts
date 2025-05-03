import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { SuccessfulHonoMiddleware } from '../../middlewares/hono/SuccessfulHonoMiddleware';
import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsPutUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(SuccessfulHonoMiddleware, UnsuccessfulHonoMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
