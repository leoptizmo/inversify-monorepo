import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { UnsuccessfulFastifyMiddleware } from '../../middlewares/fastify/UnsuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsDeleteUnsuccessfulFastifyMiddlewareController {
  @applyMiddleware(UnsuccessfulFastifyMiddleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
