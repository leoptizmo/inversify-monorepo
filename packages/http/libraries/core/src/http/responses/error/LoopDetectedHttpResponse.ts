import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class LoopDetectedHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Loop Detected') {
    super(HttpStatusCode.LOOP_DETECTED, error, message);
  }
}
