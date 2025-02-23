import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class NotImplementedHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Not Implemented') {
    super(HttpStatusCode.NOT_IMPLEMENTED, error, message);
  }
}
