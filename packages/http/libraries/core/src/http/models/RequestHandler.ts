export type RequestHandler<TRequest, TResponse, TNextFunction> = (
  req: TRequest,
  res: TResponse,
  next: TNextFunction,
) => Promise<unknown>;
