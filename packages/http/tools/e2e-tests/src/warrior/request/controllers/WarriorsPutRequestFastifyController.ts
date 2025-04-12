import { controller, PUT, request } from '@inversifyjs/http-core';
import { FastifyRequest } from 'fastify';

@controller('/warriors')
export class WarriorsPutRequestFastifyController {
  @PUT()
  public async updateWarrior(
    @request() request: FastifyRequest,
  ): Promise<Record<string, string>> {
    return {
      'x-test-header': request.headers['x-test-header'] as string,
    };
  }
}
