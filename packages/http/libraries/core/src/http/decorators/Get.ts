import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function get(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.GET, path);
}
