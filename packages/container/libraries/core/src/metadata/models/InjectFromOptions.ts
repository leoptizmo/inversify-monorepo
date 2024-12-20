import { Newable } from '@inversifyjs/common';

export interface InjectFromOptions {
  extendConstructorArguments?: boolean | undefined;
  extendProperties?: boolean | undefined;
  type: Newable;
}
