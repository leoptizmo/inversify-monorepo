import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function headers(parameterName?: string): ParameterDecorator {
  return requestParam(RequestMethodParameterType.HEADERS, parameterName);
}
