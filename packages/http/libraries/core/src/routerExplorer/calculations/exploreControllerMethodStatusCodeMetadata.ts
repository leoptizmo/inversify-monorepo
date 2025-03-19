import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';
import { controllerMethodStatusCodeMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodStatusCodeMetadataReflectKey';

export function exploreControllerMethodStatusCodeMetadata(
  controllerMethod: ControllerFunction,
): HttpStatusCode | undefined {
  return getReflectMetadata(
    controllerMethod,
    controllerMethodStatusCodeMetadataReflectKey,
  );
}
