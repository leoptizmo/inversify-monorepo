import { BindingDisposeMetadata } from '../models/BindingDisposeMetadata';
import { SingletonScopedBinding } from '../models/SingletonScopedBinding';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-var
  var __INVERSIFY_PLUGIN_DISPOSE_BINDING_MAP:
    | Map<SingletonScopedBinding, BindingDisposeMetadata>
    | undefined;
}

export function getPluginDisposeBindingMap(): Map<
  SingletonScopedBinding,
  BindingDisposeMetadata
> {
  if (globalThis.__INVERSIFY_PLUGIN_DISPOSE_BINDING_MAP === undefined) {
    globalThis.__INVERSIFY_PLUGIN_DISPOSE_BINDING_MAP = new Map();
  }

  return globalThis.__INVERSIFY_PLUGIN_DISPOSE_BINDING_MAP;
}
