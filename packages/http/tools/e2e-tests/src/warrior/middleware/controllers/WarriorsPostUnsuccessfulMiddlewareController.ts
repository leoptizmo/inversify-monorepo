import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

@controller('/warriors')
export class WarriorsPostUnsuccessfulMiddlewareController {
  @applyMiddleware(UnsuccessfulMiddleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
