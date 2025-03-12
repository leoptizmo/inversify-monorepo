import { HttpResponse } from '../responses/HttpResponse';

export interface Guard<TRequest> {
  activate(request: TRequest): Promise<boolean> | boolean;
  getHttpResponse?(): HttpResponse;
}
