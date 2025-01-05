import { bindingScopeValues } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingServiceDeactivations } from './resolveBindingServiceDeactivations';

export function resolveBindingDeactivations<TResolved>(
  params: DeactivationParams,
  binding: ScopedBinding<
    BindingType,
    typeof bindingScopeValues.Singleton,
    TResolved
  >,
  resolvedValue: TResolved,
): void | Promise<void> {
  let deactivationResult: void | Promise<void> = undefined;

  if (binding.onDeactivation !== undefined) {
    deactivationResult = binding.onDeactivation(resolvedValue);
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
