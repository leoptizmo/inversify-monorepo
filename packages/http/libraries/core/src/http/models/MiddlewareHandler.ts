export type MiddlewareHandler<
  TRequest,
  TResponse,
  TNextFunction,
  TResult = void,
> = (
  req: TRequest,
  res: TResponse,
  next: TNextFunction,
) => Promise<TResult> | TResult;
