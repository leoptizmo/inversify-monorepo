import { Factory } from '../models/Factory';
import { FactoryBinding } from '../models/FactoryBinding';
import { cloneBindingCache } from './cloneBindingCache';

/**
 * Clones a FactoryBinding
 */
export function cloneFactoryBinding<TFactory extends Factory<unknown>>(
  binding: FactoryBinding<TFactory>,
): FactoryBinding<TFactory> {
  return {
    cache: cloneBindingCache(binding.cache),
    factory: binding.factory,
    id: binding.id,
    isSatisfiedBy: binding.isSatisfiedBy,
    moduleId: binding.moduleId,
    onActivation: binding.onActivation,
    onDeactivation: binding.onDeactivation,
    scope: binding.scope,
    serviceIdentifier: binding.serviceIdentifier,
    type: binding.type,
  };
}
