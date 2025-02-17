import fastify, { FastifyReply, FastifyRequest } from 'fastify';

import { FastifyBaseScenario } from './FastifyBaseScenario';

export class FastifyBasicGetScenario extends FastifyBaseScenario {
  public async execute(): Promise<void> {
    try {
      await fetch(`http://localhost:${String(this._port)}`);
    } catch {
      void 0;
    }
  }

  public async setUp(): Promise<void> {
    this._app = fastify();

    this._app.get('/', (_req: FastifyRequest, reply: FastifyReply) => {
      reply.send('ok');
    });

    await this._app.listen({ host: '0.0.0.0', port: this._port });
  }
}
