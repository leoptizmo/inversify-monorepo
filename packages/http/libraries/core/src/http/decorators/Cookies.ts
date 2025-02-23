import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function cookies(parameterName?: string): ParameterDecorator {
  return requestParam(RequestMethodParameterType.COOKIES, parameterName);
}
