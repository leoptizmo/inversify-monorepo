import { applyMiddleware, controller, PUT } from '@inversifyjs/http-core';

import { UnsuccessfulFastifyMiddleware } from '../../middlewares/fastify/UnsuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsPutUnsuccessfulFastifyMiddlewareController {
  @applyMiddleware(UnsuccessfulFastifyMiddleware)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
