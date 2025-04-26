import { applyMiddleware, controller, GET } from '@inversifyjs/http-core';

import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';

@controller('/warriors')
export class WarriorsGetSuccessfulMiddlewareController {
  @applyMiddleware(SuccessfulMiddleware)
  @GET()
  public async getWarrior(): Promise<void> {}
}
