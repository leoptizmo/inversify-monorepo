export type RequestHandler<TRequest, TResponse, TResult = unknown> = (
  req: TRequest,
  res: TResponse,
) => Promise<TResult> | TResult;
