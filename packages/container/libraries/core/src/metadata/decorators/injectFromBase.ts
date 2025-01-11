import { Newable } from '@inversifyjs/common';
import { getBaseType } from '@inversifyjs/prototype-utils';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { InjectFromBaseOptions } from '../models/InjectFromBaseOptions';
import { injectFrom } from './injectFrom';

export function injectFromBase(
  options?: InjectFromBaseOptions,
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return (target: Function): void => {
    const baseType: Newable | undefined = getBaseType(target as Newable);

    if (baseType === undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        `Expected base type for type "${target.name}", none found.`,
      );
    }

    injectFrom({
      ...options,
      type: baseType,
    })(target);
  };
}
