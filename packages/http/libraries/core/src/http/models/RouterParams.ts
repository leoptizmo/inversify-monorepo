import { MiddlewareHandler } from './MiddlewareHandler';
import { RouteParams } from './RouteParams';

export interface RouterParams<
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
  routeParamsList: RouteParams<
    TRequest,
    TResponse,
    TNextFunction,
    THandlerResult,
    TMiddlewareHandlerResult
  >[];
}
