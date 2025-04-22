import { controller, OPTIONS, useGuard } from '@inversifyjs/http-core';

import { UnsuccessfulGuard } from '../guards/UnsuccessfulGuard';

@controller('/warriors')
export class WarriorsOptionsUnsuccessfulGuardController {
  @useGuard(UnsuccessfulGuard)
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
