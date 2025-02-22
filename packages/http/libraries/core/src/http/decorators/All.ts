import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function ALL(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.ALL, path);
}
