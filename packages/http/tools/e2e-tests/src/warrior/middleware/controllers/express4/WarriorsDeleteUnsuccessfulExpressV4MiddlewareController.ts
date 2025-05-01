import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { UnsuccessfulExpressV4Middleware } from '../../middlewares/express4/UnsuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsDeleteUnsuccessfulExpressV4MiddlewareController {
  @applyMiddleware(UnsuccessfulExpressV4Middleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
