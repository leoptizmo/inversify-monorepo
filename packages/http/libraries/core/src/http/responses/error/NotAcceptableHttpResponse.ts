import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class NotAcceptableHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Not Acceptable') {
    super(HttpStatusCode.NOT_ACCEPTABLE, error, message);
  }
}
