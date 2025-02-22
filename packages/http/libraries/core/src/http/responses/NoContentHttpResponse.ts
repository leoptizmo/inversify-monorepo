import { HttpResponse } from './HttpResponse';
import { HttpStatusCode } from './HttpStatusCode';

export class NoContentHttpResponse extends HttpResponse {
  constructor() {
    super(HttpStatusCode.NO_CONTENT);
  }
}
