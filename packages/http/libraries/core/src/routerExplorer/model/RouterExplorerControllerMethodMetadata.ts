import { ControllerMethodParameterMetadata } from '../../http/models/ControllerMethodParameterMetadata';
import { RequestMethodType } from '../../http/models/RequestMethodType';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';

export interface RouterExplorerControllerMethodMetadata {
  guardList: NewableFunction[] | undefined;
  methodKey: string | symbol;
  parameterMetadataList: ControllerMethodParameterMetadata[];
  path: string;
  postHandlerMiddlewareList: NewableFunction[] | undefined;
  preHandlerMiddlewareList: NewableFunction[] | undefined;
  requestMethodType: RequestMethodType;
  statusCode: HttpStatusCode | undefined;
}
