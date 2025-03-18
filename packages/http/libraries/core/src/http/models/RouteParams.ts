import { RequestHandler } from './RequestHandler';
import { RequestMethodType } from './RequestMethodType';

export interface RouteParams<TRequest, TResponse, TNextFunction> {
  guardList: RequestHandler<TRequest, TResponse, TNextFunction>[];
  handler: RequestHandler<TRequest, TResponse, TNextFunction>;
  path: string;
  postHandlerMiddlewareList: RequestHandler<
    TRequest,
    TResponse,
    TNextFunction
  >[];
  preHandlerMiddlewareList: RequestHandler<
    TRequest,
    TResponse,
    TNextFunction
  >[];
  requestMethodType: RequestMethodType;
}
