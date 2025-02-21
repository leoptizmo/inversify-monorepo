import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function put(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.PUT, path);
}
