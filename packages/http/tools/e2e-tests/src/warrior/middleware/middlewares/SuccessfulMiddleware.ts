import { Middleware } from '@inversifyjs/http-core';
import { injectable } from 'inversify';

@injectable()
export class SuccessfulMiddleware implements Middleware {
  public async execute(
    _request: unknown,
    _response: unknown,
    next: () => void | Promise<void>,
  ): Promise<void> {
    await next();
  }
}
