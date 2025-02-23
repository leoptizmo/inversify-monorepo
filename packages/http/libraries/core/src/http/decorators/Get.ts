import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export const GET: (path?: string) => MethodDecorator = (
  path?: string,
): MethodDecorator => requestMethod(RequestMethodType.GET, path);
