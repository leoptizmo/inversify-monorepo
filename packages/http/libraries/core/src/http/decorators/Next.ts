import { requestParamFactory } from '../calculations/requestParamFactory';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';

export function next(): ParameterDecorator {
  return requestParamFactory(RequestMethodParameterType.NEXT, []);
}
