import { controller, DELETE, setHeader } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsDeleteSetHeaderController {
  @setHeader('x-test-header', 'test-value')
  @DELETE()
  public async deleteWarrior(): Promise<void> {}
}
