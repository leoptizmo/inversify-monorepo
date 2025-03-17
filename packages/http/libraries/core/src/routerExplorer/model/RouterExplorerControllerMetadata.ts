import { RouterExplorerControllerMethodMetadata } from './RouterExplorerControllerMethodMetadata';

export interface RouterExplorerControllerMetadata {
  controllerMethodMetadataList: RouterExplorerControllerMethodMetadata[];
  guardList: NewableFunction[] | undefined;
  path: string;
  postHandlerMiddlewareList: NewableFunction[] | undefined;
  preHandlerMiddlewareList: NewableFunction[] | undefined;
  target: NewableFunction;
}
