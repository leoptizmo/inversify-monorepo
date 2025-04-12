import { controller, POST, request } from '@inversifyjs/http-core';
import { Request } from 'express';

@controller('/warriors')
export class WarriorsPostRequestExpressController {
  @POST()
  public async createWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
