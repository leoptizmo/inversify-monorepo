import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class BadRequestHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Bad Request') {
    super(HttpStatusCode.BAD_REQUEST, error, message);
  }
}
