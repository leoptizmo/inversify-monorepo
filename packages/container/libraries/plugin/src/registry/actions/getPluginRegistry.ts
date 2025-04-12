import { Plugin } from '../../plugin/models/Plugin';

export function getPluginRegistry(): Map<symbol, Plugin> {
  if (globalThis.__INVERSIFY_PLUGIN_REGISTRY === undefined) {
    globalThis.__INVERSIFY_PLUGIN_REGISTRY = new Map();
  }

  return globalThis.__INVERSIFY_PLUGIN_REGISTRY;
}
