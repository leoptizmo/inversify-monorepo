import { controller, headers, OPTIONS } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsOptionsHeadersController {
  @OPTIONS()
  public async optionsWarrior(
    @headers() headers: Record<string, string>,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': headers['x-test-header'] as string,
    };
  }
}
