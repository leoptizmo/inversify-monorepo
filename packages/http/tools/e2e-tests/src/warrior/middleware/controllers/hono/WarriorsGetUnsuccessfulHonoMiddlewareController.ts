import { applyMiddleware, controller, GET } from '@inversifyjs/http-core';

import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsGetUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(UnsuccessfulHonoMiddleware)
  @GET()
  public async getWarrior(): Promise<void> {}
}
