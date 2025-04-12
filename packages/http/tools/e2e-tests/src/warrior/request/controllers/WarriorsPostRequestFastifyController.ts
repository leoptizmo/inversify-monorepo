import { controller, POST, request } from '@inversifyjs/http-core';
import { FastifyRequest } from 'fastify';

@controller('/warriors')
export class WarriorsPostRequestFastifyController {
  @POST()
  public async createWarrior(
    @request() request: FastifyRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
