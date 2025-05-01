import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { UnsuccessfulExpressMiddleware } from '../../middlewares/express/UnsuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsPutUnsuccessfulExpressMiddlewareController {
  @applyMiddleware(UnsuccessfulExpressMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
