import { RequestMethodParameterType } from '../../http/models/RequestMethodParameterType';

export interface ControllerMethodParameterMetadata {
  parameterType: RequestMethodParameterType;
  parameterName?: string | undefined;
}
