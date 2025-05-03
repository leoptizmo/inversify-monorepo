import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { SuccessfulHonoMiddleware } from '../../middlewares/hono/SuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsPostSuccessfulHonoMiddlewareController {
  @applyMiddleware(SuccessfulHonoMiddleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
