import { ServiceIdentifier } from '@inversifyjs/common';

import {
  BindingScope,
  bindingScopeValues,
} from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';
import { resolveBindingActivations } from './resolveBindingActivations';

export function resolveScoped<
  TActivated,
  TArg,
  TType extends BindingType,
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  TBinding extends ScopedBinding<TType, BindingScope, TActivated>,
>(
  getBinding: (arg: TArg) => TBinding,
  resolve: (params: ResolutionParams, arg: TArg) => Resolved<TActivated>,
): (params: ResolutionParams, arg: TArg) => Resolved<TActivated> {
  return (params: ResolutionParams, arg: TArg): Resolved<TActivated> => {
    const binding: TBinding = getBinding(arg);

    switch (binding.scope) {
      case bindingScopeValues.Singleton: {
        if (binding.cache.isRight) {
          return binding.cache.value;
        }

        const resolvedValue: Resolved<TActivated> = resolveAndActivate(
          params,
          arg,
          binding.serviceIdentifier,
          resolve,
        );

        binding.cache = {
          isRight: true,
          value: resolvedValue,
        };

        return resolvedValue;
      }
      case bindingScopeValues.Request: {
        if (params.requestScopeCache.has(binding.id)) {
          return params.requestScopeCache.get(
            binding.id,
          ) as Resolved<TActivated>;
        }

        const resolvedValue: Resolved<TActivated> = resolveAndActivate(
          params,
          arg,
          binding.serviceIdentifier,
          resolve,
        );

        params.requestScopeCache.set(binding.id, resolvedValue);

        return resolvedValue;
      }
      case bindingScopeValues.Transient:
        return resolveAndActivate(
          params,
          arg,
          binding.serviceIdentifier,
          resolve,
        );
    }
  };
}

function resolveAndActivate<TActivated, TArg>(
  params: ResolutionParams,
  arg: TArg,
  serviceIdentifier: ServiceIdentifier,
  resolve: (params: ResolutionParams, arg: TArg) => Resolved<TActivated>,
): Resolved<TActivated> {
  return resolveBindingActivations<TActivated>(
    params,
    serviceIdentifier,
    resolve(params, arg),
  );
}
