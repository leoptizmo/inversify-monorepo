/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomParameterDecoratorHandler } from '../../http/models/CustomParameterDecoratorHandler';
import { RequestMethodParameterType } from '../../http/models/RequestMethodParameterType';

export interface ControllerMethodParameterMetadata<
  TRequest = any,
  TResponse = any,
  TResult = any,
> {
  customParameterDecoratorHandler?:
    | CustomParameterDecoratorHandler<TRequest, TResponse, TResult>
    | undefined;
  index: number;
  parameterType: RequestMethodParameterType;
  parameterName?: string | undefined;
}
