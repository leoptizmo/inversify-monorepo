import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function request(): ParameterDecorator {
  return requestParam(RequestMethodParameterType.REQUEST);
}
