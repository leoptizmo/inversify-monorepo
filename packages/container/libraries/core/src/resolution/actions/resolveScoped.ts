import {
  BindingScope,
  bindingScopeValues,
} from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved } from '../models/Resolved';

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

        const resolvedValue: Resolved<TActivated> = resolve(params, arg);

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

        const resolvedValue: Resolved<TActivated> = resolve(params, arg);

        params.requestScopeCache.set(binding.id, resolvedValue);

        return resolvedValue;
      }
      case bindingScopeValues.Transient:
        return resolve(params, arg);
    }
  };
}
