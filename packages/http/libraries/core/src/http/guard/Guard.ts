import { inject, injectable } from 'inversify';

import { HttpAdapter } from '../adapter/HttpAdapter';
import { InversifyHttpAdapter } from '../adapter/InversifyHttpAdapter';
import { Middleware } from '../models/Middleware';

@injectable()
export abstract class Guard<
  TRequest,
  TResponse,
  TNextFunction extends () => void,
> implements Middleware<TRequest, TResponse, TNextFunction>
{
  @inject(InversifyHttpAdapter)
  protected readonly _httpAdapter!: HttpAdapter<TRequest, TResponse>;

  public async execute(
    request: TRequest,
    response: TResponse,
    next: TNextFunction,
  ): Promise<void> {
    const activate: boolean = await this._activate(request, response, next);

    if (!activate) {
      this._httpAdapter.replyForbidden(request, response);
    } else {
      next();
    }
  }

  protected abstract _activate(
    request: TRequest,
    response: TResponse,
    next: TNextFunction,
  ): Promise<boolean> | boolean;
}
