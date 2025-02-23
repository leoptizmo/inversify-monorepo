import { HttpResponse } from '../HttpResponse';
import { HttpStatusCode } from '../HttpStatusCode';

export class ResetContentHttpResponse extends HttpResponse {
  constructor(body?: object | string | number | boolean) {
    super(HttpStatusCode.RESET_CONTENT, body);
  }
}
