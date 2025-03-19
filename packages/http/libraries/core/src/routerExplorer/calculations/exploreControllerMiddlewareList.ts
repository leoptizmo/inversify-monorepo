import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';

export function exploreControllerMiddlewareList(
  controller: NewableFunction,
): NewableFunction[] {
  return (
    getReflectMetadata(controller, controllerMiddlewareMetadataReflectKey) ?? []
  );
}
