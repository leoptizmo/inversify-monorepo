import { controller, headers, POST } from '@inversifyjs/http-core';

@controller('/warriors')
export class WarriorsPostHeadersController {
  @POST()
  public async postWarrior(
    @headers() headers: Record<string, string>,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': headers['x-test-header'] as string,
    };
  }
}
