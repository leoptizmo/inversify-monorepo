import { RequestHandler } from './RequestHandler';
import { RequestMethodType } from './RequestMethodType';

export interface RouteParams<TRequest, TResponse, TNextFunction, TResult> {
  guardList: RequestHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TResult | undefined
  >[];
  handler: RequestHandler<TRequest, TResponse, TNextFunction, TResult>;
  path: string;
  postHandlerMiddlewareList: RequestHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TResult
  >[];
  preHandlerMiddlewareList: RequestHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TResult
  >[];
  requestMethodType: RequestMethodType;
}
