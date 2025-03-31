import { MiddlewareHandler } from './MiddlewareHandler';
import { RouteParams } from './RouteParams';

export interface RouterParams<TRequest, TResponse, TNextFunction> {
  guardList: MiddlewareHandler<TRequest, TResponse, TNextFunction>[];
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
  routeParamsList: RouteParams<TRequest, TResponse, TNextFunction>[];
}
