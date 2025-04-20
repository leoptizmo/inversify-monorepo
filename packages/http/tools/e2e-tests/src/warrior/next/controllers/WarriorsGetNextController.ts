import { controller, GET, next } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsGetNextController {
  @GET()
  public async getWarrior(@next() nextFn: () => Promise<void>): Promise<void> {
    await nextFn();
  }
}
