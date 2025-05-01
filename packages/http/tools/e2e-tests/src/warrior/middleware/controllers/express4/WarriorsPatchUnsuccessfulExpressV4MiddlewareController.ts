import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { UnsuccessfulExpressV4Middleware } from '../../middlewares/express4/UnsuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsPatchUnsuccessfulExpressV4MiddlewareController {
  @applyMiddleware(UnsuccessfulExpressV4Middleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
