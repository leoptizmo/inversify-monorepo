import { ControllerMethodParameterMetadata } from '../../http/models/ControllerMethodParameterMetadata';
import { RequestMethodType } from '../../http/models/RequestMethodType';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';

export interface RouterExplorerControllerMethodMetadata {
  guardList: NewableFunction[] | undefined;
  middlewareList: NewableFunction[] | undefined;
  methodKey: string | symbol;
  path: string;
  requestMethodType: RequestMethodType;
  parameterMetadataList: ControllerMethodParameterMetadata[];
  statusCode: HttpStatusCode | undefined;
}
