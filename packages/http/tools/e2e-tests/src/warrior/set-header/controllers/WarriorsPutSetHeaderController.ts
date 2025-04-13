import { controller, PUT, setHeader } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPutSetHeaderController {
  @setHeader('x-test-header', 'test-value')
  @PUT()
  public async updateWarrior(): Promise<void> {}
}
