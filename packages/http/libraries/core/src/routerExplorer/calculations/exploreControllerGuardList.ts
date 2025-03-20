import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerGuardMetadataReflectKey } from '../../reflectMetadata/data/controllerGuardMetadataReflectKey';

export function exploreControllerGuardList(
  controller: NewableFunction,
): NewableFunction[] {
  return (
    getReflectMetadata(controller, controllerGuardMetadataReflectKey) ?? []
  );
}
