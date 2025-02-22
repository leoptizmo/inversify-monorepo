import { HttpResponse } from './HttpResponse';
import { HttpStatusCode } from './HttpStatusCode';

export class ErrorHttpResponse extends HttpResponse {
  constructor(statusCode: HttpStatusCode, error: string, message?: string) {
    super(statusCode, { error, message, statusCode });
  }
}
