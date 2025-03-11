import { RouterExplorerControllerMethodMetadata } from './RouterExplorerControllerMethodMetadata';

export interface RouterExplorerControllerMetadata {
  path: string;
  target: NewableFunction;
  controllerMethodMetadataList: RouterExplorerControllerMethodMetadata[];
  guardList: NewableFunction[] | undefined;
  middlewareList: NewableFunction[] | undefined;
}
