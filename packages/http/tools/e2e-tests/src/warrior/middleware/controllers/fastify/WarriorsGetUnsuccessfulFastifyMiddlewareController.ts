import { applyMiddleware, controller, GET } from '@inversifyjs/http-core';

import { UnsuccessfulFastifyMiddleware } from '../../middlewares/fastify/UnsuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsGetUnsuccessfulFastifyMiddlewareController {
  @applyMiddleware(UnsuccessfulFastifyMiddleware)
  @GET()
  public async getWarrior(): Promise<void> {}
}
