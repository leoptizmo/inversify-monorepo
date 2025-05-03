import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { SuccessfulExpressMiddleware } from '../../middlewares/express/SuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsPutSuccessfulExpressMiddlewareController {
  @applyMiddleware(SuccessfulExpressMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
