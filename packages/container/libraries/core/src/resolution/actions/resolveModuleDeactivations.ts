import { Binding } from '../../binding/models/Binding';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingsDeactivations } from './resolveBindingsDeactivations';

export function resolveModuleDeactivations(
  params: DeactivationParams,
  moduleId: number,
): void | Promise<void> {
  const bindings: Iterable<Binding> | undefined =
    params.getBindingsFromModule(moduleId);

  return resolveBindingsDeactivations(params, bindings);
}
