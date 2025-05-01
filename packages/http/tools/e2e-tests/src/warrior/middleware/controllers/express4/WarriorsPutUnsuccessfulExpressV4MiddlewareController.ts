import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { UnsuccessfulExpressV4Middleware } from '../../middlewares/express4/UnsuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsPutUnsuccessfulExpressV4MiddlewareController {
  @applyMiddleware(UnsuccessfulExpressV4Middleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
