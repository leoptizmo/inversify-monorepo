import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { UnsuccessfulExpressMiddleware } from '../../middlewares/express/UnsuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsPatchUnsuccessfulExpressMiddlewareController {
  @applyMiddleware(UnsuccessfulExpressMiddleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
