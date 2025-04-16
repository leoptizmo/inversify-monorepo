import { ApplyMiddlewareOptions } from '../models/ApplyMiddlewareOptions';

export function isApplyMiddlewareOptions(
  value: unknown,
): value is ApplyMiddlewareOptions {
  const applyMiddlewareOptions: ApplyMiddlewareOptions =
    value as ApplyMiddlewareOptions;

  return (
    value !== undefined &&
    typeof applyMiddlewareOptions === 'object' &&
    typeof applyMiddlewareOptions.middleware === 'function' &&
    typeof applyMiddlewareOptions.phase === 'string'
  );
}
