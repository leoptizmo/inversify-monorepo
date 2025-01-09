import { isPromise, Right } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import { BindingDeactivation } from '../../binding/models/BindingDeactivation';
import { bindingScopeValues } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { DeactivationParams } from '../models/DeactivationParams';
import { Resolved } from '../models/Resolved';
import { resolveBindingPreDestroy } from './resolveBindingPreDestroy';
import { resolveBindingServiceDeactivations } from './resolveBindingServiceDeactivations';

const CACHE_KEY_TYPE: keyof ScopedBinding<
  BindingType,
  typeof bindingScopeValues.Singleton,
  unknown
> = 'cache';

type CachedSingletonScopedBinding<TResolved> = Binding &
  ScopedBinding<BindingType, typeof bindingScopeValues.Singleton, TResolved> & {
    [CACHE_KEY_TYPE]: Right<Resolved<TResolved>>;
  };

export function resolveBindingDeactivations<TResolved>(
  params: DeactivationParams,
  binding: CachedSingletonScopedBinding<TResolved>,
): void | Promise<void> {
  const preDestroyResult: void | Promise<void> = resolveBindingPreDestroy(
    params,
    binding,
  );

  if (preDestroyResult === undefined) {
    return resolveBindingDeactivationsAfterPreDestroy(params, binding);
  }

  return preDestroyResult.then((): void | Promise<void> =>
    resolveBindingDeactivationsAfterPreDestroy(params, binding),
  );
}

function resolveBindingDeactivationsAfterPreDestroy<TResolved>(
  params: DeactivationParams,
  binding: CachedSingletonScopedBinding<TResolved>,
): void | Promise<void> {
  const bindingCache: Right<Resolved<TResolved>> = binding.cache;

  if (isPromise(bindingCache.value)) {
    return bindingCache.value.then(
      (resolvedValue: TResolved): void | Promise<void> =>
        resolveBindingDeactivationsAfterPreDestroyFromValue(
          params,
          binding,
          resolvedValue,
        ),
    );
  }

  return resolveBindingDeactivationsAfterPreDestroyFromValue(
    params,
    binding,
    bindingCache.value,
  );
}

function resolveBindingDeactivationsAfterPreDestroyFromValue<TResolved>(
  params: DeactivationParams,
  binding: CachedSingletonScopedBinding<TResolved>,
  resolvedValue: TResolved,
): void | Promise<void> {
  let deactivationResult: void | Promise<void> = undefined;

  if (binding.onDeactivation !== undefined) {
    const bindingDeactivation: BindingDeactivation<TResolved> =
      binding.onDeactivation;

    deactivationResult = bindingDeactivation(resolvedValue);
  }

  if (deactivationResult === undefined) {
    return resolveBindingServiceDeactivations(
      params,
      binding.serviceIdentifier,
      resolvedValue,
    );
  } else {
    return deactivationResult.then((): void | Promise<void> =>
      resolveBindingServiceDeactivations(
        params,
        binding.serviceIdentifier,
        resolvedValue,
      ),
    );
  }
}
