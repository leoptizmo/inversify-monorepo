import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

export const POST: (path?: string) => MethodDecorator = (
  path?: string,
): MethodDecorator => requestMethod(RequestMethodType.POST, path);
