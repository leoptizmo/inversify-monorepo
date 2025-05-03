import { applyMiddleware, controller, DELETE } from '@inversifyjs/http-core';

import { SuccessfulFastifyMiddleware } from '../../middlewares/fastify/SuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsDeleteSuccessfulFastifyMiddlewareController {
  @applyMiddleware(SuccessfulFastifyMiddleware)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
