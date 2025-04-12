import { controller, PUT, request } from '@inversifyjs/http-core';
import { HonoRequest } from 'hono';

@controller('/warriors')
export class WarriorsPutRequestHonoController {
  @PUT()
  public async updateWarrior(
    @request() request: HonoRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.header('x-test-header') as string,
    };
  }
}
