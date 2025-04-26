import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulMiddlewareController {
  @applyMiddleware(UnsuccessfulMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
