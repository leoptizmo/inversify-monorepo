import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

@controller('/warriors')
export class WarriorsPatchUnsuccessfulMiddlewareController {
  @applyMiddleware(UnsuccessfulMiddleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
