import { controller, PUT, useGuard } from '@inversifyjs/http-core';

import { SuccessfulGuard } from '../guards/SuccessfulGuard';

@controller('/warriors')
export class WarriorsPutSuccessfulGuardController {
  @useGuard(SuccessfulGuard)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
