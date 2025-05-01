import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsPutUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(UnsuccessfulHonoMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
