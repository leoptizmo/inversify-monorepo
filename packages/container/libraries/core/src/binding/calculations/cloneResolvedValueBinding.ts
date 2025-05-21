import { ResolvedValueBinding } from '../models/ResolvedValueBinding';
import { cloneBindingCache } from './cloneBindingCache';

/**
 * Clones a ResolvedValueBinding
 */
export function cloneResolvedValueBinding<TActivated>(
  binding: ResolvedValueBinding<TActivated>,
): ResolvedValueBinding<TActivated> {
  return {
    cache: cloneBindingCache(binding.cache),
    factory: binding.factory,
    id: binding.id,
    isSatisfiedBy: binding.isSatisfiedBy,
    metadata: binding.metadata,
    moduleId: binding.moduleId,
    onActivation: binding.onActivation,
    onDeactivation: binding.onDeactivation,
    scope: binding.scope,
    serviceIdentifier: binding.serviceIdentifier,
    type: binding.type,
  };
}
