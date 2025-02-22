import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { ControllerMetadata } from '../models/ControllerMetadata';
import { ControllerOptions } from '../models/ControllerOptions';
import { METADATA_KEY } from '../models/MetadataKey';

export function controller(
  pathOrOptions?: string | ControllerOptions,
): ClassDecorator {
  return (target: NewableFunction): void => {
    const controllerMetadata: ControllerMetadata = {
      path: '/',
      target,
    };

    if (pathOrOptions !== undefined) {
      if (typeof pathOrOptions === 'string') {
        controllerMetadata.path = pathOrOptions;
      } else {
        controllerMetadata.controllerName = pathOrOptions.controllerName;
        controllerMetadata.path = pathOrOptions.path ?? '/';
      }
    }

    let controllerMetadataList: ControllerMetadata[] | undefined =
      getReflectMetadata(Reflect, METADATA_KEY.controller);

    if (controllerMetadataList !== undefined) {
      controllerMetadataList.push(controllerMetadata);
    } else {
      controllerMetadataList = [controllerMetadata];
    }

    setReflectMetadata(
      Reflect,
      METADATA_KEY.controller,
      controllerMetadataList,
    );
  };
}
