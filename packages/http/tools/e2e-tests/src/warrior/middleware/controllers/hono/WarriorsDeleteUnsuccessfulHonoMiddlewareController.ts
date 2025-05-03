import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { SuccessfulHonoMiddleware } from '../../middlewares/hono/SuccessfulHonoMiddleware';
import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsDeleteUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(SuccessfulHonoMiddleware, UnsuccessfulHonoMiddleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
