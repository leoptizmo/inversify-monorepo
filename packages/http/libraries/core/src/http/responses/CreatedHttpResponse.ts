import { HttpResponse } from './HttpResponse';
import { HttpStatusCode } from './HttpStatusCode';

export class CreatedHttpResponse extends HttpResponse {
  constructor(body: object | number | string) {
    super(HttpStatusCode.CREATED, body);
  }
}
