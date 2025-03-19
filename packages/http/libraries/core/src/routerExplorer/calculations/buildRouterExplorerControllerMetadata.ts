import { Container } from 'inversify';

import { Controller } from '../../http/models/Controller';
import { ControllerMetadata } from '../model/ControllerMetadata';
import { ControllerMethodMetadata } from '../model/ControllerMethodMetadata';
import { MiddlewareOptions } from '../model/MiddlewareOptions';
import { RouterExplorerControllerMetadata } from '../model/RouterExplorerControllerMetadata';
import { buildMiddlewareOptionsFromApplyMiddlewareOptions } from './buildMiddlewareOptionsFromApplyMiddlewareOptions';
import { buildRouterExplorerControllerMethodMetadataList } from './buildRouterExplorerControllerMethodMetadataList';
import { exploreControllerGuardList } from './exploreControllerGuardList';
import { exploreControllerMethodMetadataList } from './exploreControllerMethodMetadataList';
import { exploreControllerMiddlewareList } from './exploreControllerMiddlewareList';

export async function buildRouterExplorerControllerMetadata(
  container: Container,
  controllerMetadata: ControllerMetadata,
): Promise<RouterExplorerControllerMetadata> {
  const controllerMethodMetadataList: ControllerMethodMetadata[] =
    exploreControllerMethodMetadataList(controllerMetadata.target);

  const controllerGuardList: NewableFunction[] = exploreControllerGuardList(
    controllerMetadata.target,
  );

  const controllerMiddlewareList: NewableFunction[] =
    exploreControllerMiddlewareList(controllerMetadata.target);

  const controller: Controller = await container.getAsync(
    controllerMetadata.target,
  );

  const middlewareOptions: MiddlewareOptions =
    buildMiddlewareOptionsFromApplyMiddlewareOptions(controllerMiddlewareList);

  return {
    controllerMethodMetadataList:
      buildRouterExplorerControllerMethodMetadataList(
        controller,
        controllerMethodMetadataList,
      ),
    guardList: controllerGuardList,
    path: controllerMetadata.path,
    postHandlerMiddlewareList: middlewareOptions.postHandlerMiddlewareList,
    preHandlerMiddlewareList: middlewareOptions.preHandlerMiddlewareList,
    target: controllerMetadata.target,
  };
}
