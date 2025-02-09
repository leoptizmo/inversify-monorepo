import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';

import { bindingMetadataMapReflectKey } from '../../reflectMetadata/data/bindingMetadataMapReflectKey';
import { BindingMetadataMap } from '../models/BindingMetadataMap';

export function buildProviderModule(): ContainerModule {
  return new ContainerModule((options: ContainerModuleLoadOptions): void => {
    const bindingMetadataMap: BindingMetadataMap | undefined =
      getReflectMetadata<BindingMetadataMap>(
        Object,
        bindingMetadataMapReflectKey,
      );

    if (bindingMetadataMap === undefined) {
      return;
    }

    for (const bindingMetadataList of bindingMetadataMap.values()) {
      for (const bindingMetadata of bindingMetadataList) {
        bindingMetadata.action(options.bind);
      }
    }
  });
}
