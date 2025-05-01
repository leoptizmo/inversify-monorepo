import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { UnsuccessfulHonoMiddleware } from '../../middlewares/hono/UnsuccessfulHonoMiddleware';

@controller('/warriors')
export class WarriorsPatchUnsuccessfulHonoMiddlewareController {
  @applyMiddleware(UnsuccessfulHonoMiddleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
