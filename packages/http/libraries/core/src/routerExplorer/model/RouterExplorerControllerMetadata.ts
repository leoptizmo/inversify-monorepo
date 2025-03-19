import { RouterExplorerControllerMethodMetadata } from './RouterExplorerControllerMethodMetadata';

export interface RouterExplorerControllerMetadata {
  controllerMethodMetadataList: RouterExplorerControllerMethodMetadata[];
  guardList: NewableFunction[];
  path: string;
  postHandlerMiddlewareList: NewableFunction[];
  preHandlerMiddlewareList: NewableFunction[];
  target: NewableFunction;
}
