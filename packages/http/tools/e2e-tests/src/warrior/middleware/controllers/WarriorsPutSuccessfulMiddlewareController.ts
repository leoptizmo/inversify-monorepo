import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';

@controller('/warriors')
export class WarriorsPutSuccessfulMiddlewareController {
  @applyMiddleware(SuccessfulMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
