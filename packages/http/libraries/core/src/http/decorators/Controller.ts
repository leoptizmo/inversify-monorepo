import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';
import { BindingScope, injectable } from 'inversify';

import { controllerMetadataReflectKey } from '../../reflectMetadata/data/controllerMetadataReflectKey';
import { ControllerMetadata } from '../../routerExplorer/model/ControllerMetadata';
import { ControllerOptions } from '../models/ControllerOptions';

export function controller(
  pathOrOptions?: string | ControllerOptions,
): ClassDecorator {
  return (target: NewableFunction): void => {
    const controllerMetadata: ControllerMetadata = {
      path: '/',
      target,
    };

    let scope: BindingScope | undefined = undefined;

    if (pathOrOptions !== undefined) {
      if (typeof pathOrOptions === 'string') {
        controllerMetadata.path = pathOrOptions;
      } else {
        controllerMetadata.path = pathOrOptions.path ?? '/';
        scope = pathOrOptions.scope;
      }
    }

    injectable(scope)(target);

    let controllerMetadataList: ControllerMetadata[] | undefined =
      getReflectMetadata(Reflect, controllerMetadataReflectKey);

    if (controllerMetadataList !== undefined) {
      controllerMetadataList.push(controllerMetadata);
    } else {
      controllerMetadataList = [controllerMetadata];
    }

    setReflectMetadata(
      Reflect,
      controllerMetadataReflectKey,
      controllerMetadataList,
    );
  };
}
