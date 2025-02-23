import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export const HEAD: (path?: string) => MethodDecorator = (
  path?: string,
): MethodDecorator => requestMethod(RequestMethodType.HEAD, path);
