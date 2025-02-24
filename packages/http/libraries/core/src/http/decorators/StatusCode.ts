import { setReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../models/ControllerFunction';
import { METADATA_KEY } from '../models/MetadataKey';
import { HttpStatusCode } from '../responses/HttpStatusCode';

export function statusCode(statusCode: HttpStatusCode): MethodDecorator {
  return (
    _target: object,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ): void => {
    setReflectMetadata(
      descriptor.value as ControllerFunction,
      METADATA_KEY.controllerMethodStatusCode,
      statusCode,
    );
  };
}
