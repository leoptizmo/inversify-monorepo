import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function delet(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.DELETE, path);
}
