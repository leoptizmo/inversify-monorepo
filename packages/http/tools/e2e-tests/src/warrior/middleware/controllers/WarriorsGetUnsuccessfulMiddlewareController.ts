import { applyMiddleware, controller, GET } from '@inversifyjs/http-core';

import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

@controller('/warriors')
export class WarriorsGetUnsuccessfulMiddlewareController {
  @applyMiddleware(UnsuccessfulMiddleware)
  @GET()
  public async getWarrior(): Promise<void> {}
}
