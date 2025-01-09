import { isPromise, Right } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import { bindingScopeValues } from '../../binding/models/BindingScope';
import {
  BindingType,
  bindingTypeValues,
} from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ClassMetadata } from '../../metadata/models/ClassMetadata';
import { DeactivationParams } from '../models/DeactivationParams';
import { Resolved } from '../models/Resolved';

const CACHE_KEY_TYPE: keyof ScopedBinding<
  BindingType,
  typeof bindingScopeValues.Singleton,
  unknown
> = 'cache';

type CachedSingletonScopedBinding<TResolved> = Binding &
  ScopedBinding<BindingType, typeof bindingScopeValues.Singleton, TResolved> & {
    [CACHE_KEY_TYPE]: Right<Resolved<TResolved>>;
  };

export function resolveBindingPreDestroy<TResolved>(
  params: DeactivationParams,
  binding: CachedSingletonScopedBinding<TResolved>,
): void | Promise<void> {
  if (binding.type === bindingTypeValues.Instance) {
    const classMetadata: ClassMetadata = params.getClassMetadata(
      binding.implementationType,
    );

    const instance: Resolved<Record<string | symbol, unknown>> = binding.cache
      .value as Resolved<Record<string | symbol, unknown>>;

    if (isPromise(instance)) {
      return instance.then(
        (instance: Record<string | symbol, unknown>): void | Promise<void> =>
          resolveInstancePreDestroy(classMetadata, instance),
      );
    } else {
      return resolveInstancePreDestroy(classMetadata, instance);
    }
  }
}

function resolveInstancePreDestroy(
  classMetadata: ClassMetadata,
  instance: Record<string | symbol, unknown>,
): void | Promise<void> {
  if (
    classMetadata.lifecycle.preDestroyMethodName !== undefined &&
    typeof instance[classMetadata.lifecycle.preDestroyMethodName] === 'function'
  ) {
    return (
      instance[
        classMetadata.lifecycle.preDestroyMethodName
      ] as () => void | Promise<void>
    )();
  }
}
