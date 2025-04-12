import { controller, DELETE, request } from '@inversifyjs/http-core';
import { HonoRequest } from 'hono';

@controller('/warriors')
export class WarriorsDeleteRequestHonoController {
  @DELETE()
  public async deleteWarrior(
    @request() request: HonoRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.header('x-test-header') as string,
    };
  }
}
