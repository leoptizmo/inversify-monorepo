import { controller, PUT, request } from '@inversifyjs/http-core';
import { Request } from 'express4';

@controller('/warriors')
export class WarriorsPutRequestExpressV4Controller {
  @PUT()
  public async updateWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
