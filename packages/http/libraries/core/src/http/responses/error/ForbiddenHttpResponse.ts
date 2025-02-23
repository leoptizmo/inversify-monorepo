import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class ForbiddenHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Forbidden') {
    super(HttpStatusCode.FORBIDDEN, error, message);
  }
}
