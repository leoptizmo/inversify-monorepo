import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodUseNativeHandlerMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodUseNativeHandlerMetadataReflectKey';

export function exploreControllerMethodUseNativeHandlerMetadata(
  targetFunction: ControllerFunction,
): boolean {
  return (
    getReflectMetadata(
      targetFunction,
      controllerMethodUseNativeHandlerMetadataReflectKey,
    ) ?? false
  );
}
