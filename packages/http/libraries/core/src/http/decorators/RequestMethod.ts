import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { ControllerMethodMetadata } from '../models/ControllerMethodMetadata';
import { METADATA_KEY } from '../models/MetadataKey';
import { RequestMethodType } from '../models/RequestMethodType';

export function requestMethod(
  requestMethodType: RequestMethodType,
  path?: string,
): MethodDecorator {
  return (target: object, methodKey: string | symbol): void => {
    const controllerMethodMetadata: ControllerMethodMetadata = {
      methodKey,
      path: path ?? '/',
      requestMethodType,
    };

    let controllerMethodMetadataList: ControllerMethodMetadata[] | undefined =
      getReflectMetadata(target.constructor, METADATA_KEY.controllerMethod);

    if (controllerMethodMetadataList !== undefined) {
      controllerMethodMetadataList.push(controllerMethodMetadata);
    } else {
      controllerMethodMetadataList = [controllerMethodMetadata];
    }

    setReflectMetadata(
      target.constructor,
      METADATA_KEY.controllerMethod,
      controllerMethodMetadataList,
    );
  };
}
