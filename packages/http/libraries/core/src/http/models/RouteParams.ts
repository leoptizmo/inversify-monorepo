import { RequestHandler } from './RequestHandler';
import { RequestMethodType } from './RequestMethodType';

export interface RouteParams<TRequest, TResponse, TNextFunction> {
  guardList: RequestHandler<TRequest, TResponse, TNextFunction>[] | undefined;
  handler: RequestHandler<TRequest, TResponse, TNextFunction>;
  path: string;
  postHandlerMiddlewareList:
    | RequestHandler<TRequest, TResponse, TNextFunction>[]
    | undefined;
  preHandlerMiddlewareList:
    | RequestHandler<TRequest, TResponse, TNextFunction>[]
    | undefined;
  requestMethodType: RequestMethodType;
}
