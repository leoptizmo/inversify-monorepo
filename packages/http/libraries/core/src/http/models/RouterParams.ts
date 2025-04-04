import { RequestHandler } from './RequestHandler';
import { RouteParams } from './RouteParams';

export interface RouterParams<TRequest, TResponse, TNextFunction, TResult> {
  guardList: RequestHandler<
    TRequest,
    TResponse,
    TNextFunction,
    TResult | undefined
  >[];
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
  routeParamsList: RouteParams<TRequest, TResponse, TNextFunction, TResult>[];
}
