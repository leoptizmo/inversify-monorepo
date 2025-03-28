import { MiddlewareHandler } from './MiddlewareHandler';
import { RequestHandler } from './RequestHandler';
import { RequestMethodType } from './RequestMethodType';

export interface RouteParams<TRequest, TResponse, TNextFunction> {
  guardList: MiddlewareHandler<TRequest, TResponse, TNextFunction>[];
  handler: RequestHandler<TRequest, TResponse>;
  path: string;
  postHandlerMiddlewareList: MiddlewareHandler<
    TRequest,
    TResponse,
    TNextFunction
  >[];
  preHandlerMiddlewareList: MiddlewareHandler<
    TRequest,
    TResponse,
    TNextFunction
  >[];
  requestMethodType: RequestMethodType;
}
