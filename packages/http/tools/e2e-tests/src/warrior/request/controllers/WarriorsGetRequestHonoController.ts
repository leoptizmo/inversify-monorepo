import { controller, GET, request } from '@inversifyjs/http-core';
import { HonoRequest } from 'hono';

@controller('/warriors')
export class WarriorsGetRequestHonoController {
  @GET()
  public async getWarrior(
    @request() request: HonoRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.header('x-test-header') as string,
    };
  }
}
