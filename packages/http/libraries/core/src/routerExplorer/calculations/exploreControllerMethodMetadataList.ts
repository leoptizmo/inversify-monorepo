import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerMethodMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMetadataReflectKey';
import { ControllerMethodMetadata } from '../model/ControllerMethodMetadata';

export function exploreControllerMethodMetadataList(
  controller: NewableFunction,
): ControllerMethodMetadata[] {
  return (
    getReflectMetadata(controller, controllerMethodMetadataReflectKey) ?? []
  );
}
