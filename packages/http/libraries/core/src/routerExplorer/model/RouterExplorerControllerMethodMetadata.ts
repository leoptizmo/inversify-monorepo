/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestMethodType } from '../../http/models/RequestMethodType';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';
import { ControllerMethodParameterMetadata } from './ControllerMethodParameterMetadata';

export interface RouterExplorerControllerMethodMetadata<
  TRequest = any,
  TResponse = any,
  TResult = any,
> {
  guardList: NewableFunction[];
  headerMetadataList: [string, string][];
  methodKey: string | symbol;
  parameterMetadataList: ControllerMethodParameterMetadata<
    TRequest,
    TResponse,
    TResult
  >[];
  path: string;
  postHandlerMiddlewareList: NewableFunction[];
  preHandlerMiddlewareList: NewableFunction[];
  requestMethodType: RequestMethodType;
  statusCode: HttpStatusCode | undefined;
  useNativeHandler: boolean;
}
