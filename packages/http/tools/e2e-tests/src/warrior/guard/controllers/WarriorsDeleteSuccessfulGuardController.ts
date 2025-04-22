import { controller, DELETE, useGuard } from '@inversifyjs/http-core';

import { SuccessfulGuard } from '../guards/SuccessfulGuard';

@controller('/warriors')
export class WarriorsDeleteSuccessfulGuardController {
  @useGuard(SuccessfulGuard)
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
