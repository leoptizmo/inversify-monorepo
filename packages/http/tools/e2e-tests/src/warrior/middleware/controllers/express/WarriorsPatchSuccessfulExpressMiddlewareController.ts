import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { SuccessfulExpressMiddleware } from '../../middlewares/express/SuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsPatchSuccessfulExpressMiddlewareController {
  @applyMiddleware(SuccessfulExpressMiddleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
