import { controller, headers, POST } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPostHeadersNamedController {
  @POST()
  public async postWarrior(
    @headers('x-test-header') testHeader: string,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': testHeader,
    };
  }
}
