import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { SuccessfulExpressV4Middleware } from '../../middlewares/express4/SuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsPostSuccessfulExpressV4MiddlewareController {
  @applyMiddleware(SuccessfulExpressV4Middleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
