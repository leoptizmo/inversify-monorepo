import { BindingDisposeMetadata } from '../models/BindingDisposeMetadata';
import { SingletonScopedBinding } from '../models/SingletonScopedBinding';
import { getPluginDisposeBindingMap } from './getPluginDisposeBindingMap';

export function getPluginDisposeBinding(
  binding: SingletonScopedBinding,
): BindingDisposeMetadata | undefined {
  const map: Map<SingletonScopedBinding, BindingDisposeMetadata> =
    getPluginDisposeBindingMap();

  return map.get(binding);
}
