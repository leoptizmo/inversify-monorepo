import { controller, PUT, useGuard } from '@inversifyjs/http-core';

import { UnsuccessfulGuard } from '../guards/UnsuccessfulGuard';

@controller('/warriors')
export class WarriorsPutUnsuccessfulGuardController {
  @useGuard(UnsuccessfulGuard)
  @PUT()
  public async putWarrior(): Promise<void> {}
}
