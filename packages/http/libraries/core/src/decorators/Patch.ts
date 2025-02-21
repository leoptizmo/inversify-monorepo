import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export function patch(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.PATCH, path);
}
