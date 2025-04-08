import { controller, GET, headers } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsGetHeadersNamedController {
  @GET()
  public async getWarrior(
    @headers('x-test-header') testHeader: string,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': testHeader,
    };
  }
}
