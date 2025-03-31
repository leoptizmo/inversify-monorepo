import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';
import { Newable } from 'inversify';

import { controllerMethodMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';
import { controllerMiddlewareMetadataReflectKey } from '../../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';
import { Middleware } from '../middleware/model/Middleware';
import { ApplyMiddlewareOptions } from '../models/ApplyMiddlewareOptions';
import { ControllerFunction } from '../models/ControllerFunction';

export function applyMiddleware(
  ...middlewareList: (Newable<Middleware> | ApplyMiddlewareOptions)[]
): ClassDecorator & MethodDecorator {
  return (
    target: object,
    _key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ): void => {
    let middlewareMetadataList:
      | (NewableFunction | ApplyMiddlewareOptions)[]
      | undefined = undefined;

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
