/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type MiddlewareHandler<TRequest, TResponse, TNextFunction> = (
  req: TRequest,
  res: TResponse,
  next: TNextFunction,
) => Promise<unknown> | unknown;
