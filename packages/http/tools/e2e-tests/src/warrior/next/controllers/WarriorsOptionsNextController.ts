import { controller, next, OPTIONS } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsOptionsNextController {
  @OPTIONS()
  public async optionsWarrior(
    @next() nextFn: () => Promise<void>,
  ): Promise<void> {
    await nextFn();
  }
}
