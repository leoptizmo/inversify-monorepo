import { controller, OPTIONS, setHeader } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsOptionsSetHeaderController {
  @setHeader('x-test-header', 'test-value')
  @OPTIONS()
  public async optionsWarrior(): Promise<void> {}
}
