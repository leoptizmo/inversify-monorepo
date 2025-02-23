import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export const PUT: (path?: string) => MethodDecorator = (
  path?: string,
): MethodDecorator => requestMethod(RequestMethodType.PUT, path);
