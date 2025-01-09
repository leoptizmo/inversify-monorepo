import { ServiceIdentifier } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingsDeactivations } from './resolveBindingsDeactivations';

export function resolveServiceDeactivations(
  params: DeactivationParams,
  serviceIdentifier: ServiceIdentifier,
): void | Promise<void> {
  const bindings: Iterable<Binding> | undefined =
    params.getBindings(serviceIdentifier);

  return resolveBindingsDeactivations(params, bindings);
}
