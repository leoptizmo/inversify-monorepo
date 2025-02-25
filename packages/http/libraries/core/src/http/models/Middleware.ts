export interface Middleware<TRequest, TResponse, TNextFunction> {
  execute(
    request: TRequest,
    response: TResponse,
    next: TNextFunction,
  ): Promise<void>;
}
