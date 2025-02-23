import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export const ALL: (path?: string) => MethodDecorator = (
  path?: string,
): MethodDecorator => requestMethod(RequestMethodType.ALL, path);
