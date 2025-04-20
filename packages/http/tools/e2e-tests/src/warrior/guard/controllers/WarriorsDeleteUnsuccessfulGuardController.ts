import { controller, DELETE, useGuard } from '@inversifyjs/http-core';

import { UnsuccessfulGuard } from '../guards/UnsuccessfulGuard';

@controller('/warriors')
export class WarriorsDeleteUnsuccessfulGuardController {
  @useGuard(UnsuccessfulGuard)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
