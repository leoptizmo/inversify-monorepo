import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function params(parameterName?: string): ParameterDecorator {
  return requestParam(RequestMethodParameterType.PARAMS, parameterName);
}
