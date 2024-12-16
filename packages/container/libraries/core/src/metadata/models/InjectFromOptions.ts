import { Newable } from '@inversifyjs/common';

export interface InjectFromOptions {
  extendConstructorArguments?: boolean;
  extendProperties?: boolean;
  type: Newable;
}
