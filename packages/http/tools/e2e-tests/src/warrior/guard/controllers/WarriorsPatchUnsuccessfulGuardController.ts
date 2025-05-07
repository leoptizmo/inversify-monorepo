import { controller, PATCH, useGuard } from '@inversifyjs/http-core';

import { UnsuccessfulGuard } from '../guards/UnsuccessfulGuard';

@controller('/warriors')
export class WarriorsPatchUnsuccessfulGuardController {
  @useGuard(UnsuccessfulGuard)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
