import { ApplyMiddlewareOptions } from '../models/ApplyMiddlewareOptions';

export function isApplyMiddlewareOptions(
  value: unknown,
): value is ApplyMiddlewareOptions {
  const applyMiddlewareOptions: ApplyMiddlewareOptions =
    value as ApplyMiddlewareOptions;

  return (
    typeof applyMiddlewareOptions.middleware === 'function' &&
    typeof applyMiddlewareOptions.phase === 'string'
  );
}
