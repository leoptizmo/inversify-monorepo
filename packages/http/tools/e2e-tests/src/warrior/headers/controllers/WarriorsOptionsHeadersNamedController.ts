import { controller, headers, OPTIONS } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsOptionsHeadersNamedController {
  @OPTIONS()
  public async optionsWarrior(
    @headers('x-test-header') testHeader: string,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': testHeader,
    };
  }
}
