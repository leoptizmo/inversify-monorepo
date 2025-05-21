import { Provider } from '../models/Provider';
import { ProviderBinding } from '../models/ProviderBinding';
import { cloneBindingCache } from './cloneBindingCache';

/**
 * Clones a ProviderBinding
 */
export function cloneProviderBinding<TProvider extends Provider<unknown>>(
  binding: ProviderBinding<TProvider>,
): ProviderBinding<TProvider> {
  return {
    cache: cloneBindingCache(binding.cache),
    id: binding.id,
    isSatisfiedBy: binding.isSatisfiedBy,
    moduleId: binding.moduleId,
    onActivation: binding.onActivation,
    onDeactivation: binding.onDeactivation,
    provider: binding.provider,
    scope: binding.scope,
    serviceIdentifier: binding.serviceIdentifier,
    type: binding.type,
  };
}
