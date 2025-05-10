import { controller, next, PUT } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPutNextController {
  @PUT()
  public async putWarrior(@next() nextFn: () => Promise<void>): Promise<void> {
    await nextFn();
  }
}
