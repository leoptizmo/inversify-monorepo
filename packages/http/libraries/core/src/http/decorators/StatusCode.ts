import { setReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { controllerMethodStatusCodeMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodStatusCodeMetadataReflectKey';
import { ControllerFunction } from '../models/ControllerFunction';
import { HttpStatusCode } from '../responses/HttpStatusCode';

export function statusCode(statusCode: HttpStatusCode): MethodDecorator {
  return (
    _target: object,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ): void => {
    setReflectMetadata(
      descriptor.value as ControllerFunction,
      controllerMethodStatusCodeMetadataReflectKey,
      statusCode,
    );
  };
}
