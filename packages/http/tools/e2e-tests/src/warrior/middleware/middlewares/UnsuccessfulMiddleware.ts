import { HttpStatusCode, Middleware } from '@inversifyjs/http-core';
import { injectable } from 'inversify';

@injectable()
export class UnsuccessfulMiddleware
  implements Middleware<any, any, any, unknown>
{
  public async execute(
    _request: unknown,
    response: {
      send?: () => unknown;
      text?: () => unknown;
      status: (code: number) => void;
    },
    _next: unknown,
  ): Promise<unknown> {
    response.status(HttpStatusCode.FORBIDDEN);
    if (response.send !== undefined) {
      response.send();
    }

    if (response.text !== undefined) {
      response.text();
    }

    return undefined;
  }
}
