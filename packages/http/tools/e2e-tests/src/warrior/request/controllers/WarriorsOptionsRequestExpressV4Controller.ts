import { controller, OPTIONS, request } from '@inversifyjs/http-core';
import { Request } from 'express4';

@controller('/warriors')
export class WarriorsOptionsRequestExpressV4Controller {
  @OPTIONS()
  public async getWarrior(
    @request() request: Request,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
