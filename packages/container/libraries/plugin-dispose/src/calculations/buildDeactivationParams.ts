import {
  DeactivationParams,
  getClassMetadata,
} from '@gritcode/inversifyjs-core';
import { PluginContext } from '@gritcode/inversifyjs-plugin';

export function buildDeactivationParams(
  pluginContext: PluginContext,
): DeactivationParams {
  return {
    getBindings: pluginContext.bindingService.get.bind(
      pluginContext.bindingService,
    ),
    getBindingsFromModule: pluginContext.bindingService.getByModuleId.bind(
      pluginContext.bindingService,
    ),
    getClassMetadata,
    getDeactivations: pluginContext.deactivationService.get.bind(
      pluginContext.deactivationService,
    ),
  };
}
