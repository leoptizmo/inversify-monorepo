import { bindingScopeValues } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ResolutionParams } from '../models/ResolutionParams';

export function resolveSingletonScopedBinding<
  TActivated,
  TType extends BindingType,
  TBinding extends ScopedBinding<
    TType,
    typeof bindingScopeValues.Singleton,
    TActivated
  >,
>(
  resolve: (params: ResolutionParams, binding: TBinding) => TActivated,
): (params: ResolutionParams, binding: TBinding) => TActivated {
  return (params: ResolutionParams, binding: TBinding): TActivated => {
    if (binding.cache.isRight) {
      return binding.cache.value;
    }

    const resolvedValue: TActivated = resolve(params, binding);

    binding.cache = {
      isRight: true,
      value: resolvedValue,
    };

    return resolvedValue;
  };
}
