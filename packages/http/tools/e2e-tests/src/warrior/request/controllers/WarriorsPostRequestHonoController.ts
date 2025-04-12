import { controller, POST, request } from '@inversifyjs/http-core';
import { HonoRequest } from 'hono';

@controller('/warriors')
export class WarriorsPostRequestHonoController {
  @POST()
  public async createWarrior(
    @request() request: HonoRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.header('x-test-header') as string,
    };
  }
}
