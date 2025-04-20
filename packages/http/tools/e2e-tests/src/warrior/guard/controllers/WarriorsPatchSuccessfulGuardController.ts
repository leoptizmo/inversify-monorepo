import { controller, PATCH, useGuard } from '@inversifyjs/http-core';

import { SuccessfulGuard } from '../guards/SuccessfulGuard';

@controller('/warriors')
export class WarriorsPatchSuccessfulGuardController {
  @useGuard(SuccessfulGuard)
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
