import { Controller } from '../../http/models/Controller';
import { ControllerFunction } from '../../http/models/ControllerFunction';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';
import { ControllerMethodMetadata } from '../model/ControllerMethodMetadata';
import { ControllerMethodParameterMetadata } from '../model/ControllerMethodParameterMetadata';
import { MiddlewareOptions } from '../model/MiddlewareOptions';
import { RouterExplorerControllerMethodMetadata } from '../model/RouterExplorerControllerMethodMetadata';
import { buildMiddlewareOptionsFromApplyMiddlewareOptions } from './buildMiddlewareOptionsFromApplyMiddlewareOptions';
import { exploreControllerMethodGuardList } from './exploreControllerMethodGuardList';
import { exploreControllerMethodHeaderMetadataList } from './exploreControllerMethodHeaderMetadataList';
import { exploreControllerMethodMiddlewareList } from './exploreControllerMethodMiddlewareList';
import { exploreControllerMethodParameterMetadataList } from './exploreControllerMethodParameterMetadataList';
import { exploreControllerMethodStatusCodeMetadata } from './exploreControllerMethodStatusCodeMetadata';
import { exploreControllerMethodUseNativeHandlerMetadata } from './exploreControllerMethodUseNativeHandlerMetadata';

export function buildRouterExplorerControllerMethodMetadata(
  controller: Controller,
  controllerMethodMetadata: ControllerMethodMetadata,
): RouterExplorerControllerMethodMetadata {
  const targetFunction: ControllerFunction = controller[
    controllerMethodMetadata.methodKey
  ] as ControllerFunction;

  const controllerMethodParameterMetadataList: ControllerMethodParameterMetadata[] =
    exploreControllerMethodParameterMetadataList(targetFunction);

  const controllerMethodStatusCode: HttpStatusCode | undefined =
    exploreControllerMethodStatusCodeMetadata(targetFunction);

  const controllerMethodGuardList: NewableFunction[] =
    exploreControllerMethodGuardList(targetFunction);

  const controllerMethodMiddlewareList: NewableFunction[] =
    exploreControllerMethodMiddlewareList(targetFunction);

  const middlewareOptions: MiddlewareOptions =
    buildMiddlewareOptionsFromApplyMiddlewareOptions(
      controllerMethodMiddlewareList,
    );

  const headerMetadataList: [string, string][] =
    exploreControllerMethodHeaderMetadataList(targetFunction);

  const useNativeHandler: boolean =
    exploreControllerMethodUseNativeHandlerMetadata(targetFunction);

  return {
    guardList: controllerMethodGuardList,
    headerMetadataList,
    methodKey: controllerMethodMetadata.methodKey,
    parameterMetadataList: controllerMethodParameterMetadataList,
    path: controllerMethodMetadata.path,
    postHandlerMiddlewareList: middlewareOptions.postHandlerMiddlewareList,
    preHandlerMiddlewareList: middlewareOptions.preHandlerMiddlewareList,
    requestMethodType: controllerMethodMetadata.requestMethodType,
    statusCode: controllerMethodStatusCode,
    useNativeHandler,
  };
}
