import { ControllerFunction } from '../../http/models/ControllerFunction';
import { ControllerMethodParameterMetadata } from '../../http/models/ControllerMethodParameterMetadata';
import { RequestMethodType } from '../../http/models/RequestMethodType';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';

export interface RouterExplorerControllerMethodMetadata {
  guardList: NewableFunction[] | undefined;
  middlewareList: NewableFunction[] | undefined;
  path: string;
  requestMethodType: RequestMethodType;
  target: ControllerFunction;
  parameterMetadataList: ControllerMethodParameterMetadata[];
  statusCode: HttpStatusCode | undefined;
}
