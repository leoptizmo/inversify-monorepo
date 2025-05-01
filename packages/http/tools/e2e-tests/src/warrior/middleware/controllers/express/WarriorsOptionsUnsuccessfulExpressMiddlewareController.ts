import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { UnsuccessfulExpressMiddleware } from '../../middlewares/express/UnsuccessfulExpressMiddleware';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulExpressMiddlewareController {
  @applyMiddleware(UnsuccessfulExpressMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
