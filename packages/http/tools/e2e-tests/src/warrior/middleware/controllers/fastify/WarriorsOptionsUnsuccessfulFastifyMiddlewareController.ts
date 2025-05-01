import { applyMiddleware, controller, OPTIONS } from '@inversifyjs/http-core';

import { UnsuccessfulFastifyMiddleware } from '../../middlewares/fastify/UnsuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulFastifyMiddlewareController {
  @applyMiddleware(UnsuccessfulFastifyMiddleware)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
