import { RequestHandler } from './RequestHandler';
import { RequestMethodType } from './RequestMethodType';

export interface RouterParams<TRequest, TResponse, TNextFunction> {
  handler: RequestHandler<TRequest, TResponse, TNextFunction>;
  path: string;
  requestMethodType: RequestMethodType;
}
