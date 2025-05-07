import { controller, GET, useGuard } from '@inversifyjs/http-core';

import { SuccessfulGuard } from '../guards/SuccessfulGuard';

@controller('/warriors')
export class WarriorsGetSuccessfulGuardController {
  @useGuard(SuccessfulGuard)
  @GET()
  public async getWarrior(): Promise<void> {}
}
