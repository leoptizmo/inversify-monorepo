import { controller, headers, PATCH } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPatchHeadersNamedController {
  @PATCH()
  public async patchWarrior(
    @headers('x-test-header') testHeader: string,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': testHeader,
    };
  }
}
