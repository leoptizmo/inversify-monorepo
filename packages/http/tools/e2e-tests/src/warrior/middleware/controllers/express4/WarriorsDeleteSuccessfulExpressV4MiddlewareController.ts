import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { SuccessfulExpressV4Middleware } from '../../middlewares/express4/SuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsDeleteSuccessfulExpressV4MiddlewareController {
  @applyMiddleware(SuccessfulExpressV4Middleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
