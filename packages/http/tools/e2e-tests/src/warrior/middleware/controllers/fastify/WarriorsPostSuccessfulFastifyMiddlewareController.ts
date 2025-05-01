import { applyMiddleware, controller, POST } from '@inversifyjs/http-core';

import { SuccessfulFastifyMiddleware } from '../../middlewares/fastify/SuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsPostSuccessfulFastifyMiddlewareController {
  @applyMiddleware(SuccessfulFastifyMiddleware)
  @POST()
  public async postWarrior(): Promise<void> {}
}
