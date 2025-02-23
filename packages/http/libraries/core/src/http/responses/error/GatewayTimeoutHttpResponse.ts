import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class GatewayTimeoutHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Gateway Timeout') {
    super(HttpStatusCode.GATEWAY_TIMEOUT, error, message);
  }
}
