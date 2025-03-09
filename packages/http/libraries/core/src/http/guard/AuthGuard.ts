import { injectable } from 'inversify';

import { UserRequest } from '../models/UserRequest';
import { Guard } from './Guard';

@injectable()
export abstract class AuthGuard<
  TRequest extends UserRequest,
  TResponse,
  TNextFunction extends () => void,
> extends Guard<TRequest, TResponse, TNextFunction> {
  protected async _activate(
    request: TRequest,
    response: TResponse,
    next: TNextFunction,
  ): Promise<boolean> {
    const token: string = await this._getTokenFromRequest(request);
    const user: Record<string, unknown> | undefined =
      await this._validateToken(token);

    if (user === undefined) {
      this._httpAdapter.replyUnauthorized(request, response);
    } else {
      request.user = user;
      next();
    }

    return true;
  }

  protected abstract _getTokenFromRequest(
    request: TRequest,
  ): Promise<string> | string;

  protected abstract _validateToken(
    token: string,
  ):
    | Promise<Record<string, unknown> | undefined>
    | Record<string, unknown>
    | undefined;
}
