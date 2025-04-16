import { Newable } from 'inversify';

import { CustomParameterDecoratorHandler } from '../models/CustomParameterDecoratorHandler';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { Pipe } from '../pipe/model/Pipe';
import { requestParamFactory } from './requestParamFactory';

export function createCustomParameterDecorator<TRequest, TResponse, TResult>(
  handler: CustomParameterDecoratorHandler<TRequest, TResponse, TResult>,
  ...parameterPipeList: (Newable<Pipe> | Pipe)[]
): ParameterDecorator {
  return requestParamFactory(
    RequestMethodParameterType.CUSTOM,
    parameterPipeList,
    undefined,
    handler,
  );
}
