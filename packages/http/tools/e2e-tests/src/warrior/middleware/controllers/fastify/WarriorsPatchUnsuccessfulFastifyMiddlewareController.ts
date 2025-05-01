import { applyMiddleware, controller, PATCH } from '@inversifyjs/http-core';

import { UnsuccessfulFastifyMiddleware } from '../../middlewares/fastify/UnsuccessfulFastifyMiddleware';

@controller('/warriors')
export class WarriorsPatchUnsuccessfulFastifyMiddlewareController {
  @applyMiddleware(UnsuccessfulFastifyMiddleware)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
