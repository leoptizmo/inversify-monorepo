import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function query(parameterName?: string): ParameterDecorator {
  return requestParam(RequestMethodParameterType.QUERY, parameterName);
}
