import { isPromise } from '@inversifyjs/common';

import { BindingActivation } from '../../binding/models/BindingActivation';
import { BindingScope } from '../../binding/models/BindingScope';
import { BindingType } from '../../binding/models/BindingType';
import { ScopedBinding } from '../../binding/models/ScopedBinding';
import { ResolutionParams } from '../models/ResolutionParams';
import { Resolved, SyncResolved } from '../models/Resolved';
import { resolveBindingServiceActivations } from './resolveBindingServiceActivations';

export function resolveBindingActivations<TActivated>(
  params: ResolutionParams,
  binding: ScopedBinding<BindingType, BindingScope, TActivated>,
  value: Resolved<TActivated>,
): Resolved<TActivated> {
  let activationResult: TActivated | Promise<TActivated> = value;

  if (binding.onActivation !== undefined) {
    const onActivation: BindingActivation<TActivated> = binding.onActivation;

    if (isPromise(activationResult)) {
      activationResult = activationResult.then(
        (resolved: SyncResolved<TActivated>): Resolved<TActivated> =>
          onActivation(params.context, resolved),
      );
    } else {
      activationResult = onActivation(params.context, activationResult);
    }
  }

  return resolveBindingServiceActivations<TActivated>(
    params,
    binding.serviceIdentifier,
    activationResult,
  );
}
