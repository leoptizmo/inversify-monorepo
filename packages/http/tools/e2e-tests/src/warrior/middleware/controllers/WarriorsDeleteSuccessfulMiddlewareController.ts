import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';

@controller('/warriors')
export class WarriorsDeleteSuccessfulMiddlewareController {
  @applyMiddleware(SuccessfulMiddleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
