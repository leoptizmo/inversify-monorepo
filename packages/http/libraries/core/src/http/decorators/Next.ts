import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { requestParam } from './RequestParam';

export function next(): ParameterDecorator {
  return requestParam(RequestMethodParameterType.NEXT);
}
