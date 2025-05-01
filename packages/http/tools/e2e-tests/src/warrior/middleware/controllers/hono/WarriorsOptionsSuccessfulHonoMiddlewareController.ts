import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { SuccessfulHonoMiddleware } from '../../middlewares/hono/SuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsOptionsSuccessfulHonoMiddlewareController {
  @applyMiddleware(SuccessfulHonoMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
