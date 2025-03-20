import { RequestHandler } from './RequestHandler';
import { RouteParams } from './RouteParams';

export interface RouterParams<TRequest, TResponse, TNextFunction> {
  guardList: RequestHandler<TRequest, TResponse, TNextFunction>[];
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
  routeParamsList: RouteParams<TRequest, TResponse, TNextFunction>[];
}
