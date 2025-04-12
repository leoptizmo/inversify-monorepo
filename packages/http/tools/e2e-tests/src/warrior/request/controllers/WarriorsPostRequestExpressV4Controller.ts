import { controller, POST, request } from '@inversifyjs/http-core';
import { Request } from 'express4';

@controller('/warriors')
export class WarriorsPostRequestExpressV4Controller {
  @POST()
  public async createWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
