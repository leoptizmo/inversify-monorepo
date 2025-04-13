import { controller, POST, setHeader } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPostSetHeaderController {
  @setHeader('x-test-header', 'test-value')
  @POST()
  public async createWarrior(): Promise<void> {}
}
