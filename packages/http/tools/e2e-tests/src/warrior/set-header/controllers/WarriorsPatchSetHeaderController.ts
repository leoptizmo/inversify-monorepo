import { controller, PATCH, setHeader } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPatchSetHeaderController {
  @setHeader('x-test-header', 'test-value')
  @PATCH()
  public async patchWarrior(): Promise<void> {}
}
