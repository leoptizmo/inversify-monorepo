import { controller, GET, request } from '@inversifyjs/http-core';
import { Request } from 'express';

@controller('/warriors')
export class WarriorsGetRequestExpressController {
  @GET()
  public async getWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
