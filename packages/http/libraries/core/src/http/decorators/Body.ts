import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function body(parameterName?: string): ParameterDecorator {
  return requestParam(RequestMethodParameterType.BODY, parameterName);
}
