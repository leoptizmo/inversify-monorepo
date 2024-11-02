import { Newable } from './Newable';

export type ServiceIdentifier<TInstance = unknown> =
  | string
  | symbol
  | Newable<TInstance>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function;
