import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { controllerMethodParameterMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodParameterMetadataReflectKey';
import { ControllerMethodParameterMetadata } from '../models/ControllerMethodParameterMetadata';
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
    let parameterMetadataObject:
      | {
          [key: string]: ControllerMethodParameterMetadata[];
        }
      | undefined = getReflectMetadata(
      target.constructor,
      controllerMethodParameterMetadataReflectKey,
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
      controllerMethodParameterMetadataReflectKey,
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
