import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';

@controller('/warriors')
export class WarriorsPatchSuccessfulMiddlewareController {
  @applyMiddleware(SuccessfulMiddleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
