import { ControllerMethodMetadata } from './ControllerMethodMetadata';
import { RequestHandler } from './RequestHandler';

export type RouterParams<TRequest, TResponse, TNextFunction> = Omit<
  ControllerMethodMetadata,
  'methodKey'
> & {
  handler: RequestHandler<TRequest, TResponse, TNextFunction>;
};
