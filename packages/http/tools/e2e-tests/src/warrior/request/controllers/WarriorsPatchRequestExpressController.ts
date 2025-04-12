import { controller, PATCH, request } from '@inversifyjs/http-core';
import { Request } from 'express';

@controller('/warriors')
export class WarriorsPatchRequestExpressController {
  @PATCH()
  public async patchWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
