import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function PUT(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.PUT, path);
}
