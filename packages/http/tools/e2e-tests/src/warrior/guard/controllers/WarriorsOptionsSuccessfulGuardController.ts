import { controller, OPTIONS, useGuard } from '@inversifyjs/http-core';

import { SuccessfulGuard } from '../guards/SuccessfulGuard';

@controller('/warriors')
export class WarriorsOptionsSuccessfulGuardController {
  @useGuard(SuccessfulGuard)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
