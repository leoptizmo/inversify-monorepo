import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { SuccessfulExpressMiddleware } from '../../middlewares/express/SuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsOptionsSuccessfulExpressMiddlewareController {
  @applyMiddleware(SuccessfulExpressMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
