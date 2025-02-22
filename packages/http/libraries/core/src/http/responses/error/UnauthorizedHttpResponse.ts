import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class UnauthorizedHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Unauthorized') {
    super(HttpStatusCode.UNAUTHORIZED, error, message);
  }
}
