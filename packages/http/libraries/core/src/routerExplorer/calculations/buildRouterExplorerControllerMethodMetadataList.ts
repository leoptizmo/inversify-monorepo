import { Controller } from '../../http/models/Controller';
import { ControllerMethodMetadata } from '../model/ControllerMethodMetadata';
import { RouterExplorerControllerMethodMetadata } from '../model/RouterExplorerControllerMethodMetadata';
import { buildRouterExplorerControllerMethodMetadata } from './buildRouterExplorerControllerMethodMetadata';

export function buildRouterExplorerControllerMethodMetadataList(
  controller: Controller,
  controllerMethodMetadataList: ControllerMethodMetadata[],
): RouterExplorerControllerMethodMetadata[] {
  return controllerMethodMetadataList.map(
    (controllerMethodMetadata: ControllerMethodMetadata) =>
      buildRouterExplorerControllerMethodMetadata(
        controller,
        controllerMethodMetadata,
      ),
  );
}
