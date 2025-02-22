import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

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
    console.log(target.constructor);
    console.log((target as { [key: string]: unknown })[key as string]);
    let parameterMetadataObject:
      | {
          [key: string]: ControllerMethodParameterMetadata[];
        }
      | undefined = getReflectMetadata(
      target.constructor,
      METADATA_KEY.controllerMethodParameter,
    );

    const controllerMethodParameterMetadata: ControllerMethodParameterMetadata =
      {
        index,
        parameterName,
        parameterType,
      };

    if (parameterMetadataObject === undefined) {
      parameterMetadataObject = {
        [key as string]: [controllerMethodParameterMetadata],
      };
    } else {
      if (parameterMetadataObject[key as string] === undefined) {
        parameterMetadataObject[key as string] = [
          controllerMethodParameterMetadata,
        ];
      } else {
        insertParameterMetadata(
          parameterMetadataObject[
            key as string
          ] as ControllerMethodParameterMetadata[],
          controllerMethodParameterMetadata,
        );
      }
    }

    setReflectMetadata(
      target.constructor,
      METADATA_KEY.controllerMethodParameter,
      parameterMetadataObject,
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
