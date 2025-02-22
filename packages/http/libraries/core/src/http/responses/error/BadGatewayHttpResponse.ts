import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class BadGatewayHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Bad Gateway') {
    super(HttpStatusCode.BAD_GATEWAY, error, message);
  }
}
