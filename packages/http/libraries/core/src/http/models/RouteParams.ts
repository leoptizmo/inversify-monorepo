import { MiddlewareHandler } from './MiddlewareHandler';
import { RequestHandler } from './RequestHandler';
import { RequestMethodType } from './RequestMethodType';

export interface RouteParams<
  TRequest,
  TResponse,
  TNextFunction,
  THandlerResult = unknown,
  TMiddlewareHandlerResult = void,
> {
  guardList: MiddlewareHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TMiddlewareHandlerResult
  >[];
  handler: RequestHandler<TRequest, TResponse, THandlerResult>;
  path: string;
  postHandlerMiddlewareList: MiddlewareHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TMiddlewareHandlerResult
  >[];
  preHandlerMiddlewareList: MiddlewareHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TMiddlewareHandlerResult
  >[];
  requestMethodType: RequestMethodType;
}
