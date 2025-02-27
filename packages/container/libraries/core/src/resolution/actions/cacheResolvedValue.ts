import { isPromise } from '@inversifyjs/common';

import { BindingScope } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { Resolved, SyncResolved } from '../models/Resolved';

export function cacheResolvedValue<
  TActivated,
  TType extends BindingType,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  binding: TBinding,
  resolvedValue: Resolved<TActivated>,
): Resolved<TActivated> {
  if (isPromise(resolvedValue)) {
    binding.cache = {
      isRight: true,
      value: resolvedValue,
    };

    return resolvedValue.then((syncResolvedValue: SyncResolved<TActivated>) =>
      cacheSyncResolvedValue(binding, syncResolvedValue),
    );
  }

  return cacheSyncResolvedValue(binding, resolvedValue);
}

function cacheSyncResolvedValue<
  TActivated,
  TType extends BindingType,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  binding: TBinding,
  resolvedValue: SyncResolved<TActivated>,
): SyncResolved<TActivated> {
  binding.cache = {
    isRight: true,
    value: resolvedValue,
  };

  return resolvedValue;
}
