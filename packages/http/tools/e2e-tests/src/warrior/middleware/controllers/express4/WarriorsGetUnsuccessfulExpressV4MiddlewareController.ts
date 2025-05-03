import { applyMiddleware, controller, GET } from '@inversifyjs/http-core';

import { SuccessfulExpressV4Middleware } from '../../middlewares/express4/SuccessfulExpressV4Middleware';
import { UnsuccessfulExpressV4Middleware } from '../../middlewares/express4/UnsuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsGetUnsuccessfulExpressV4MiddlewareController {
  @applyMiddleware(
    SuccessfulExpressV4Middleware,
    UnsuccessfulExpressV4Middleware,
  )
  @GET()
  public async getWarrior(): Promise<void> {}
}
