import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { UnsuccessfulExpressV4Middleware } from '../../middlewares/express4/UnsuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsPostUnsuccessfulExpressV4MiddlewareController {
  @applyMiddleware(UnsuccessfulExpressV4Middleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
