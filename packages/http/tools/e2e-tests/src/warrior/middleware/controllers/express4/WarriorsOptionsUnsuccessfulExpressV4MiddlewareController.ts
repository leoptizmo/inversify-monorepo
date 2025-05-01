import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { UnsuccessfulExpressV4Middleware } from '../../middlewares/express4/UnsuccessfulExpressV4Middleware';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulExpressV4MiddlewareController {
  @applyMiddleware(UnsuccessfulExpressV4Middleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
