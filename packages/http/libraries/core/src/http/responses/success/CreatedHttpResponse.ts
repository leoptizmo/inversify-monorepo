import { HttpResponse } from '../HttpResponse';
import { HttpStatusCode } from '../HttpStatusCode';

export class CreatedHttpResponse extends HttpResponse {
  constructor(body?: object | string | number | boolean) {
    super(HttpStatusCode.CREATED, body);
  }
}
