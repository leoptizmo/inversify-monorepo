import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';
import { Newable } from 'inversify';

import { controllerMethodMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';
import { controllerMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';
import { ControllerFunction } from '../models/ControllerFunction';
import { Middleware } from '../models/Middleware';

export function applyMiddleware(
  ...middlewareList: Newable<Middleware>[]
): ClassDecorator & MethodDecorator {
  return (
    target: object,
    _key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ): void => {
    let middlewareMetadataList: NewableFunction[] | undefined = undefined;

    if (descriptor === undefined) {
      middlewareMetadataList = getReflectMetadata(
        target,
        controllerMiddlewareMetadataReflectKey,
      );
    } else {
      middlewareMetadataList = getReflectMetadata(
        descriptor.value as ControllerFunction,
        controllerMethodMiddlewareMetadataReflectKey,
      );
    }

    if (middlewareMetadataList !== undefined) {
      middlewareMetadataList.push(...middlewareList);
    } else {
      middlewareMetadataList = middlewareList;
    }

    if (descriptor === undefined) {
      setReflectMetadata(
        target,
        controllerMiddlewareMetadataReflectKey,
        middlewareMetadataList,
      );
    } else {
      setReflectMetadata(
        descriptor.value as ControllerFunction,
        controllerMethodMiddlewareMetadataReflectKey,
        middlewareMetadataList,
      );
    }
  };
}
