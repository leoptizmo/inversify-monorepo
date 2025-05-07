import { controller, POST, useGuard } from '@inversifyjs/http-core';

import { UnsuccessfulGuard } from '../guards/UnsuccessfulGuard';

@controller('/warriors')
export class WarriorsPostUnsuccessfulGuardController {
  @useGuard(UnsuccessfulGuard)
  @POST()
  public async postWarrior(): Promise<void> {}
}
