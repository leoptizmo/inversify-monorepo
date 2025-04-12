import { controller, DELETE, request } from '@inversifyjs/http-core';
import { Request } from 'express';

@controller('/warriors')
export class WarriorsDeleteRequestExpressController {
  @DELETE()
  public async deleteWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
