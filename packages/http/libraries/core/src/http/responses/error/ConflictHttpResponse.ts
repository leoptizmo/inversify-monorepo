import { HttpStatusCode } from '../HttpStatusCode';
import { ErrorHttpResponse } from './ErrorHttpResponse';

export class ConflictHttpResponse extends ErrorHttpResponse {
  constructor(message?: string, error: string = 'Conflict') {
    super(HttpStatusCode.CONFLICT, error, message);
  }
}
