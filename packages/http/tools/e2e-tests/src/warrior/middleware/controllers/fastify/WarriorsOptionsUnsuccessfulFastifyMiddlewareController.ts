import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { SuccessfulFastifyMiddleware } from '../../middlewares/fastify/SuccessfulFastifyMiddleware';
import { UnsuccessfulFastifyMiddleware } from '../../middlewares/fastify/UnsuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulFastifyMiddlewareController {
  @applyMiddleware(SuccessfulFastifyMiddleware, UnsuccessfulFastifyMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
