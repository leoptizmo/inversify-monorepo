import { controller, GET, request } from '@inversifyjs/http-core';
import { FastifyRequest } from 'fastify';

@controller('/warriors')
export class WarriorsGetRequestFastifyController {
  @GET()
  public async getWarrior(
    @request() request: FastifyRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
