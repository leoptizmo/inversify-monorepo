import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function post(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.POST, path);
}
