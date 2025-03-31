import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';

export function exploreControllerMethodMiddlewareList(
  controllerMethod: ControllerFunction,
): NewableFunction[] {
  return (
    getReflectMetadata(
      controllerMethod,
      controllerMethodMiddlewareMetadataReflectKey,
    ) ?? []
  );
}
