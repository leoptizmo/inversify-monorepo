import { Right } from '@inversifyjs/common';

import { isScopedBinding } from '../../binding/calculations/isScopedBinding';
import { Binding } from '../../binding/models/Binding';
import { bindingScopeValues } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { DeactivationParams } from '../models/DeactivationParams';
import { Resolved } from '../models/Resolved';
import { resolveBindingDeactivations } from './resolveBindingDeactivations';

const CACHE_KEY_TYPE: keyof ScopedBinding<
  BindingType,
  typeof bindingScopeValues.Singleton,
  unknown
> = 'cache';

type CachedSingletonScopedBinding<TResolved> = Binding &
  ScopedBinding<BindingType, typeof bindingScopeValues.Singleton, TResolved> & {
    [CACHE_KEY_TYPE]: Right<Resolved<TResolved>>;
  };

export function resolveBindingsDeactivations(
  params: DeactivationParams,
  bindings: Iterable<Binding> | undefined,
): void | Promise<void> {
  if (bindings === undefined) {
    return;
  }

  const singletonScopedBindings: CachedSingletonScopedBinding<unknown>[] =
    filterCachedSinglentonScopedBindings(bindings);

  const deactivationPromiseResults: Promise<void>[] = [];

  for (const binding of singletonScopedBindings) {
    const deactivationResult: void | Promise<void> =
      resolveBindingDeactivations(params, binding);

    if (deactivationResult !== undefined) {
      deactivationPromiseResults.push(deactivationResult);
    }
  }

  if (deactivationPromiseResults.length > 0) {
    return Promise.all(deactivationPromiseResults).then(() => undefined);
  }
}

function filterCachedSinglentonScopedBindings(
  bindings: Iterable<Binding>,
): CachedSingletonScopedBinding<unknown>[] {
  const filteredBindings: CachedSingletonScopedBinding<unknown>[] = [];

  for (const binding of bindings) {
    if (
      isScopedBinding(binding) &&
      binding.scope === bindingScopeValues.Singleton &&
      binding.cache.isRight
    ) {
      filteredBindings.push(binding as CachedSingletonScopedBinding<unknown>);
    }
  }

  return filteredBindings;
}
