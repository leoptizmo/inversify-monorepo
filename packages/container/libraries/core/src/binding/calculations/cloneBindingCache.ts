import { Either } from '@inversifyjs/common';

import { Resolved } from '../../resolution/models/Resolved';

export function cloneBindingCache<TActivated>(
  cache: Either<undefined, Resolved<TActivated>>,
): Either<undefined, Resolved<TActivated>> {
  if (cache.isRight) {
    return {
      isRight: true,
      value: cache.value,
    };
  }

  // A left cache is not cloned, just returned
  return cache;
}
