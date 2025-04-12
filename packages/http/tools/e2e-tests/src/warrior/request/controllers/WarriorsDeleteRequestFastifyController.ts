import { controller, DELETE, request } from '@inversifyjs/http-core';
import { FastifyRequest } from 'fastify';

@controller('/warriors')
export class WarriorsDeleteRequestFastifyController {
  @DELETE()
  public async deleteWarrior(
    @request() request: FastifyRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
