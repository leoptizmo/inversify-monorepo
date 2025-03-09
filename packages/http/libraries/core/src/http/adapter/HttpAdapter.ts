export interface HttpAdapter<TRequest, TResponse> {
  replyForbidden(request: TRequest, response: TResponse): void;
  replyUnauthorized(request: TRequest, response: TResponse): void;
}
