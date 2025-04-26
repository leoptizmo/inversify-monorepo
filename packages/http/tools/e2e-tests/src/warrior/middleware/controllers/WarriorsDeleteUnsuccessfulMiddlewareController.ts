import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

@controller('/warriors')
export class WarriorsDeleteUnsuccessfulMiddlewareController {
  @applyMiddleware(UnsuccessfulMiddleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
