import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodParameterMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodParameterMetadataReflectKey';
import { ControllerMethodParameterMetadata } from '../model/ControllerMethodParameterMetadata';

export function exploreControllerMethodParameterMetadataList(
  controllerMethod: ControllerFunction,
): (ControllerMethodParameterMetadata | undefined)[] {
  return (
    getReflectMetadata(
      controllerMethod,
      controllerMethodParameterMetadataReflectKey,
    ) ?? []
  );
}
