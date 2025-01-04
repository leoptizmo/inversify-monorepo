import { ServiceIdentifier } from '@inversifyjs/common';

import { isScopedBinding } from '../../binding/calculations/isScopedBinding';
import { Binding } from '../../binding/models/Binding';
import { bindingScopeValues } from '../../binding/models/BindingScope';
import {
  BindingType,
  bindingTypeValues,
} from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ClassMetadata } from '../../metadata/models/ClassMetadata';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingDeactivations } from './resolveBindingDeactivations';

type SingletonScopedBinding = Binding &
  ScopedBinding<BindingType, typeof bindingScopeValues.Singleton, unknown>;

export function resolveServiceDeactivations(
  params: DeactivationParams,
  serviceIdentifier: ServiceIdentifier,
): void | Promise<void> {
  const bindings: Iterable<Binding> | undefined =
    params.getBindings(serviceIdentifier);

  if (bindings === undefined) {
    return;
  }

  const singletonScopedBindings: SingletonScopedBinding[] =
    filterSinglentonScopedBindings(bindings);

  const deactivationPromiseResults: Promise<void>[] = [];

  for (const binding of singletonScopedBindings) {
    if (binding.cache.isRight) {
      const preDestroyResult: void | Promise<void> = resolveBindingPreDestroy(
        params,
        binding,
      );

      let deactivationResult: void | Promise<void>;

      if (preDestroyResult === undefined) {
        deactivationResult = resolveBindingDeactivations(
          params,
          binding,
          binding.cache.value,
        );
      } else {
        deactivationResult = preDestroyResult.then((): void | Promise<void> =>
          resolveBindingDeactivations(params, binding, binding.cache.value),
        );
      }

      if (deactivationResult !== undefined) {
        deactivationPromiseResults.push(deactivationResult);
      }
    }
  }

  if (deactivationPromiseResults.length > 0) {
    return Promise.all(deactivationPromiseResults).then(() => undefined);
  }
}

function filterSinglentonScopedBindings(
  bindings: Iterable<Binding>,
): SingletonScopedBinding[] {
  const filteredBindings: SingletonScopedBinding[] = [];

  for (const binding of bindings) {
    if (
      isScopedBinding(binding) &&
      binding.scope === bindingScopeValues.Singleton
    ) {
      filteredBindings.push(binding as SingletonScopedBinding);
    }
  }

  return filteredBindings;
}

function resolveBindingPreDestroy(
  params: DeactivationParams,
  binding: SingletonScopedBinding,
): void | Promise<void> {
  if (binding.type === bindingTypeValues.Instance) {
    const classMetadata: ClassMetadata = params.getClassMetadata(
      binding.implementationType,
    );

    if (classMetadata.lifecycle.preDestroyMethodName !== undefined) {
      const instance: Record<string | symbol, unknown> = binding.cache
        .value as Record<string | symbol, unknown>;

      if (
        typeof instance[classMetadata.lifecycle.preDestroyMethodName] ===
        'function'
      ) {
        return (
          instance[
            classMetadata.lifecycle.preDestroyMethodName
          ] as () => void | Promise<void>
        )();
      }
    }
  }
}
