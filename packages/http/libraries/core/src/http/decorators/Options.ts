import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function options(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.OPTIONS, path);
}
