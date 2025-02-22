import { HttpResponse } from '../HttpResponse';
import { HttpStatusCode } from '../HttpStatusCode';

export class NonAuthoritativeInformationHttpResponse extends HttpResponse {
  constructor(body?: object | string | number | boolean) {
    super(HttpStatusCode.NON_AUTHORITATIVE_INFORMATION, body);
  }
}
