import { Plugin } from './plugin/models/Plugin';

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
  var __INVERSIFY_PLUGIN_REGISTRY: Map<symbol, Plugin> | undefined;
}
