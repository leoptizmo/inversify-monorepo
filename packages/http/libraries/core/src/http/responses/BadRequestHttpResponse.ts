import { ErrorHttpResponse } from './ErrorHttpResponse';
import { HttpStatusCode } from './HttpStatusCode';

export class BadRequestHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Not Found') {
    super(HttpStatusCode.BAD_REQUEST, error, message);
  }
}
