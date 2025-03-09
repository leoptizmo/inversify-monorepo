import { injectable } from 'inversify';

import { UserRequest } from '../models/UserRequest';
import { Guard } from './Guard';

@injectable()
export abstract class AuthGuard<
  TRequest extends UserRequest,
  TResponse,
  TNextFunction extends () => void,
> extends Guard<TRequest, TResponse, TNextFunction> {
  public async _activate(
    request: TRequest,
    response: TResponse,
    next: TNextFunction,
  ): Promise<boolean> {
    const token: string = await this._getTokenFromRequest(request);
    const user: unknown | undefined = await this._validateToken(token);

    if (user === undefined) {
      this._httpAdapter.replyUnauthorized(request, response);
    } else {
      request.user = user;
      next();
    }

    return true;
  }

  protected abstract _getTokenFromRequest(request: TRequest): Promise<string>;
  protected abstract _validateToken(
    token: string,
  ): Promise<unknown | undefined> | unknown | undefined;
}
