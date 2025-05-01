import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(UnsuccessfulHonoMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
