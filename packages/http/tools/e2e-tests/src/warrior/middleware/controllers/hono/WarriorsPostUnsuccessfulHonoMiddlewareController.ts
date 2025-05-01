import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsPostUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(UnsuccessfulHonoMiddleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
