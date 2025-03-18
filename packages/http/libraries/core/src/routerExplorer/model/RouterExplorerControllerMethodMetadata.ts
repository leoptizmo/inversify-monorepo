import { RequestMethodType } from '../../http/models/RequestMethodType';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';
import { ControllerMethodParameterMetadata } from './ControllerMethodParameterMetadata';

export interface RouterExplorerControllerMethodMetadata {
  guardList: NewableFunction[];
  methodKey: string | symbol;
  parameterMetadataList: ControllerMethodParameterMetadata[];
  path: string;
  postHandlerMiddlewareList: NewableFunction[];
  preHandlerMiddlewareList: NewableFunction[];
  requestMethodType: RequestMethodType;
  statusCode: HttpStatusCode | undefined;
}
