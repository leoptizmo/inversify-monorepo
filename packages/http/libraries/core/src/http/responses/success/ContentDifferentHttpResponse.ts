import { HttpResponse } from '../HttpResponse';
import { HttpStatusCode } from '../HttpStatusCode';

export class ContentDifferentHttpResponse extends HttpResponse {
  constructor(body?: object | string | number | boolean) {
    super(HttpStatusCode.CONTENT_DIFFERENT, body);
  }
}
