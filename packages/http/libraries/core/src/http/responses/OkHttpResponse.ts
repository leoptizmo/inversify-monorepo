import { HttpResponse } from './HttpResponse';
import { HttpStatusCode } from './HttpStatusCode';

export class OkHttpResponse extends HttpResponse {
  constructor(body: object | number | string) {
    super(HttpStatusCode.OK, body);
  }
}
