import { HttpResponse } from '../HttpResponse';
import { HttpStatusCode } from '../HttpStatusCode';

export class PartialContentHttpResponse extends HttpResponse {
  constructor(body?: object | string | number | boolean) {
    super(HttpStatusCode.PARTIAL_CONTENT, body);
  }
}
