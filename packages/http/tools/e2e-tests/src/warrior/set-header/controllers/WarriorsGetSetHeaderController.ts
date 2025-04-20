import { controller, GET, setHeader } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsGetSetHeaderController {
  @setHeader('x-test-header', 'test-value')
  @GET()
  public async getWarrior(): Promise<void> {}
}
