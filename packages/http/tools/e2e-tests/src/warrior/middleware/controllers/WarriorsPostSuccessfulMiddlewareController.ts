import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';

@controller('/warriors')
export class WarriorsPostSuccessfulMiddlewareController {
  @applyMiddleware(SuccessfulMiddleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
