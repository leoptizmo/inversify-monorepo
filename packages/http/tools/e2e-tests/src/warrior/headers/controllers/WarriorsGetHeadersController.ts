import { controller, GET, headers } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsGetHeadersController {
  @GET()
  public async getWarrior(
    @headers() headers: Record<string, string>,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': headers['x-test-header'] as string,
    };
  }
}
