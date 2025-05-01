import { applyMiddleware, controller, GET } from '@inversifyjs/http-core';

import { UnsuccessfulExpressMiddleware } from '../../middlewares/express/UnsuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsGetUnsuccessfulExpressMiddlewareController {
  @applyMiddleware(UnsuccessfulExpressMiddleware)
  @GET()
  public async getWarrior(): Promise<void> {}
}
