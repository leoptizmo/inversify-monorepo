/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export type RequestHandler<TRequest, TResponse> = (
  req: TRequest,
  res: TResponse,
) => Promise<unknown> | unknown;
