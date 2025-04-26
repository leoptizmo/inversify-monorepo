import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';

@controller('/warriors')
export class WarriorsOptionsSuccessfulMiddlewareController {
  @applyMiddleware(SuccessfulMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
