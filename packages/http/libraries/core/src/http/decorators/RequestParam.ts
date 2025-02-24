import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { Controller } from '../models/Controller';
import { ControllerFunction } from '../models/ControllerFunction';
import { ControllerMethodParameterMetadata } from '../models/ControllerMethodParameterMetadata';
import { METADATA_KEY } from '../models/MetadataKey';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';

export function requestParam(
  parameterType: RequestMethodParameterType,
  parameterName?: string,
): ParameterDecorator {
  return (
    target: object,
    key: string | symbol | undefined,
    index: number,
  ): void => {
    let parameterMetadataList: ControllerMethodParameterMetadata[] | undefined =
      getReflectMetadata(
        (target as Controller)[key as string] as ControllerFunction,
        METADATA_KEY.controllerMethodParameter,
      );

    const controllerMethodParameterMetadata: ControllerMethodParameterMetadata =
      {
        index,
        parameterName,
        parameterType,
      };

    if (parameterMetadataList === undefined) {
      parameterMetadataList = [controllerMethodParameterMetadata];
    } else {
      insertParameterMetadata(
        parameterMetadataList,
        controllerMethodParameterMetadata,
      );
    }

    setReflectMetadata(
      (target as Controller)[key as string] as ControllerFunction,
      METADATA_KEY.controllerMethodParameter,
      parameterMetadataList,
    );
  };
}

function insertParameterMetadata(
  parameterMetadataList: ControllerMethodParameterMetadata[],
  newParameterMetadata: ControllerMethodParameterMetadata,
): void {
  let i: number = 0;

  while (
    i < parameterMetadataList.length &&
    (parameterMetadataList[i]?.index ?? 0) < newParameterMetadata.index
  ) {
    i++;
  }

  parameterMetadataList.splice(i, 0, newParameterMetadata);
}
