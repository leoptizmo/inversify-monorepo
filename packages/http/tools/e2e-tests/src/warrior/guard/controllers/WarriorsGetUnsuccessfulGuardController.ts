import { controller, GET, useGuard } from '@inversifyjs/http-core';

import { UnsuccessfulGuard } from '../guards/UnsuccessfulGuard';

@controller('/warriors')
export class WarriorsGetUnsuccessfulGuardController {
  @useGuard(UnsuccessfulGuard)
  @GET()
  public async getWarrior(): Promise<void> {}
}
