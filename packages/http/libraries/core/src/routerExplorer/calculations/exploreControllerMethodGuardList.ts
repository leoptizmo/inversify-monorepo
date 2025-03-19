import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodGuardMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodGuardMetadataReflectKey';

export function exploreControllerMethodGuardList(
  controllerMethod: ControllerFunction,
): NewableFunction[] {
  return (
    getReflectMetadata(
      controllerMethod,
      controllerMethodGuardMetadataReflectKey,
    ) ?? []
  );
}
