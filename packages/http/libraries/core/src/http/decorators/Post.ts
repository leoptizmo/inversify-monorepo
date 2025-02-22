import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function POST(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.POST, path);
}
