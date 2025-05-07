import { controller, POST, useGuard } from '@inversifyjs/http-core';

import { SuccessfulGuard } from '../guards/SuccessfulGuard';

@controller('/warriors')
export class WarriorsPostSuccessfulGuardController {
  @useGuard(SuccessfulGuard)
  @POST()
  public async postWarrior(): Promise<void> {}
}
