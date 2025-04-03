import { controller, DELETE, headers } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsDeleteHeadersNamedController {
  @DELETE()
  public async deleteWarrior(
    @headers('x-test-header') testHeader: string,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': testHeader,
    };
  }
}
