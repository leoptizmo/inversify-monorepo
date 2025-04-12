import { controller, PATCH, request } from '@inversifyjs/http-core';
import { HonoRequest } from 'hono';

@controller('/warriors')
export class WarriorsPatchRequestHonoController {
  @PATCH()
  public async patchWarrior(
    @request() request: HonoRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.header('x-test-header') as string,
    };
  }
}
