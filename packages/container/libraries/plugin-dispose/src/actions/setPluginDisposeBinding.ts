import { BindingDisposeMetadata } from '../models/BindingDisposeMetadata';
import { SingletonScopedBinding } from '../models/SingletonScopedBinding';
import { getPluginDisposeBindingMap } from './getPluginDisposeBindingMap';

export function setPluginDisposeBinding(
  binding: SingletonScopedBinding,
  metadata: BindingDisposeMetadata,
): void {
  const map: Map<SingletonScopedBinding, BindingDisposeMetadata> =
    getPluginDisposeBindingMap();

  map.set(binding, metadata);
}
