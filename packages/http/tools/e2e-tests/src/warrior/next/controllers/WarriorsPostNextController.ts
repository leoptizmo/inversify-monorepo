import { controller, next, POST } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPostNextController {
  @POST()
  public async postWarrior(@next() nextFn: () => Promise<void>): Promise<void> {
    await nextFn();
  }
}
