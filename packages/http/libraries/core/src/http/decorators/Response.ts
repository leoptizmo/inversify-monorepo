import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function response(): ParameterDecorator {
  return requestParam(RequestMethodParameterType.RESPONSE);
}
