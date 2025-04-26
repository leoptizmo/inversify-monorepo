import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

@controller('/warriors')
export class WarriorsPutUnsuccessfulMiddlewareController {
  @applyMiddleware(UnsuccessfulMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
