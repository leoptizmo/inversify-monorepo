import { controller, headers, PUT } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPutHeadersNamedController {
  @PUT()
  public async putWarrior(
    @headers('x-test-header') testHeader: string,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': testHeader,
    };
  }
}
