import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { UnsuccessfulExpressMiddleware } from '../../middlewares/express/UnsuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsDeleteUnsuccessfulExpressMiddlewareController {
  @applyMiddleware(UnsuccessfulExpressMiddleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
