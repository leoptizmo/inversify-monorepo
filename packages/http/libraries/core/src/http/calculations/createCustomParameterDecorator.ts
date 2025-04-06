import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { InversifyHttpAdapterError } from '../../error/models/InversifyHttpAdapterError';
import { InversifyHttpAdapterErrorKind } from '../../error/models/InversifyHttpAdapterErrorKind';
import { controllerMethodParameterMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodParameterMetadataReflectKey';
import { ControllerMethodParameterMetadata } from '../../routerExplorer/model/ControllerMethodParameterMetadata';
import { Controller } from '../models/Controller';
import { ControllerFunction } from '../models/ControllerFunction';
import { CustomParameterDecoratorHandler } from '../models/CustomParameterDecoratorHandler';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { insertParameterMetadata } from './insertParameterMetadata';

export function createCustomParameterDecorator<TRequest, TResponse, TResult>(
  handler: CustomParameterDecoratorHandler<TRequest, TResponse, TResult>,
): ParameterDecorator {
  return (
    target: object,
    key: string | symbol | undefined,
    index: number,
  ): void => {
    let controllerFunction: ControllerFunction | undefined = undefined;

    if (key !== undefined) {
      controllerFunction = (target as Controller)[key];
    }

    if (controllerFunction === undefined) {
      throw new InversifyHttpAdapterError(
        InversifyHttpAdapterErrorKind.requestParamIncorrectUse,
      );
    }

    let parameterMetadataList: ControllerMethodParameterMetadata[] | undefined =
      getReflectMetadata(
        controllerFunction,
        controllerMethodParameterMetadataReflectKey,
      );

    const controllerMethodParameterMetadata: ControllerMethodParameterMetadata =
      {
        customParameterDecoratorHandler: handler,
        index,
        parameterType: RequestMethodParameterType.CUSTOM,
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
      controllerFunction,
      controllerMethodParameterMetadataReflectKey,
      parameterMetadataList,
    );
  };
}
