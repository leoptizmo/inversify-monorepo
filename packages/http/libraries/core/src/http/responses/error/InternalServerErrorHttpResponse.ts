import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class InternalServerErrorHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Internal Server Error') {
    super(HttpStatusCode.INTERNAL_SERVER_ERROR, error, message);
  }
}
