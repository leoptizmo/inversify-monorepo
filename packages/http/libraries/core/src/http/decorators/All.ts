import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function all(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.ALL, path);
}
